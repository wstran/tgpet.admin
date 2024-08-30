
import CryptoJS from 'crypto-js';
import Database from '../libs/database';
import { NextApiRequest, NextApiResponse } from "next";
import geoip from 'geoip-lite';

export interface User {
    tele_id: string;
    name: string;
    username: string;
    auth_date: Date;
};

interface TeleUser extends User {
    hash: string;
};

export interface RequestWithUser extends NextApiRequest {
    tele_user: TeleUser;
};

export default async function (req: NextApiRequest, res: NextApiResponse, next: (req: RequestWithUser, res: NextApiResponse) => void) {
    if (process.env.NODE_ENV === 'development') {
        const user = { tele_id: '1853181392' } as User;

        (req as RequestWithUser).tele_user = { ...user, hash: '0x' };

        return next(req as RequestWithUser, res);
    };

    const secretKey = CryptoJS.HmacSHA256(process.env.BOT_TOKEN as string, 'WebAppData');

    const webapp_init = req.headers['--webapp-init'];

    if (!webapp_init) return res.status(400).json({ message: 'Bad request.' });

    const params = new URLSearchParams(decodeURIComponent(webapp_init as string));

    const hash = params.get('hash');

    params.delete('hash');

    const dataCheckString = Array.from(params.entries()).sort().map(e => `${e[0]}=${e[1]}`).join('\n');

    const hmac = CryptoJS.HmacSHA256(dataCheckString, secretKey).toString(CryptoJS.enc.Hex);

    if (hmac !== hash) {
        return res.status(403).json({ message: 'Invalid user data.' });
    };

    const user_param = params.get('user');

    const auth_date = Number(params.get('auth_date')) * 1000;

    if (typeof user_param !== 'string' || isNaN(auth_date)) {
        return res.status(400).json({ message: 'Bad request.' });
    };

    const parse_user = JSON.parse(user_param);

    const tele_id = String(parse_user.id);

    const user = {
        tele_id,
        name: [parse_user.first_name, parse_user.last_name || ''].join(' '),
        username: parse_user.username,
        auth_date: new Date(auth_date),
    } as User;

    (req as RequestWithUser).tele_user = { ...user, hash };

    /* const [REDIS_KEY, REDIS_VALUE] = ['ADMIN:AUTH_CACHE', tele_id];

    const acquired = await redisWrapper.add(REDIS_KEY, REDIS_VALUE, 60 * 5);

    if (!acquired) return next(req as RequestWithUser, res); */

    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!ip) return res.status(400).json({ message: 'Bad request.' });

    if (Array.isArray(ip)) ip = ip[0];

    if (ip.includes(',')) ip = ip.split(', ')[0];

    const lookup = geoip.lookup(ip);

    if (lookup === null) return res.status(400).json({ message: 'Bad request.' });

    const formattedLocation = {
        ip_address: ip,
        country_code: lookup.country,
        region_code: lookup.region,
        city_name: lookup.city,
        latitude: lookup.ll[0],
        longitude: lookup.ll[1],
        timezone: lookup.timezone || 'Unknown'
    };

    const dbInstance = Database.getInstance();
    const db = await dbInstance.getDb();
    const client = dbInstance.getClient();
    const dashUserCollection = db.collection('dash-users');
    const dashLocationCollection = db.collection('dash-locations');

    const session = client.startSession({
        defaultTransactionOptions: {
            readConcern: { level: 'local' },
            writeConcern: { w: 1 },
            retryWrites: false
        }
    });

    try {
        await session.withTransaction(async () => {
            const now_date = new Date();

            const insert: { created_at?: Date } = {};

            const update_user_result = await dashUserCollection.findOneAndUpdate(
                { tele_id },
                {
                    $set: {
                        name: user.name,
                        username: user.username,
                        auth_date: user.auth_date,
                        last_active_at: now_date,
                        ip_location: formattedLocation
                    },
                    $setOnInsert: insert,
                },
                {
                    upsert: true,
                    returnDocument: 'before',
                    projection: { _id: 0, 'ip_location.ip_address': 1 },
                    session
                }
            );

            const previous_ip = update_user_result?.ip_location?.ip_address;

            const update_location_result = await dashLocationCollection.updateOne(
                {
                    tele_id,
                    ip_address: ip,
                    ...(previous_ip !== ip && { previous_ip })
                },
                {
                    $set: { ...formattedLocation, last_active_at: now_date },
                    $setOnInsert: { tele_id, created_at: now_date },
                },
                { upsert: true, session }
            );

            if (update_location_result.acknowledged !== true) {
                res.status(500).json({ message: 'Transaction failed to commit.' });
                throw new Error('Transaction failed to commit.');
            };
        });

        const is_admin = await dashUserCollection.countDocuments({ tele_id, is_admin: true });

        if (is_admin === 0) {
            res.status(403).json({ message: 'Unauthorized user.' });
            throw new Error('Unauthorized user.');
        };

        return next(req as RequestWithUser, res);
    } catch (error) {
        /* await redisWrapper.delete(REDIS_KEY, REDIS_VALUE); */
        if (!res.headersSent) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error.' });
        };
    } finally {
        await session.endSession();
    };
};