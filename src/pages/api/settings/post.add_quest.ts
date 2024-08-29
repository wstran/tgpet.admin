import { NextApiRequest, NextApiResponse } from "next";
import telegramWebappMiddleware, { RequestWithUser } from "@/middlewares/telegram-webapp";
import Database from "@/libs/database";

const handler = async (req: RequestWithUser, res: NextApiResponse) => {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });

    const { quest_id, quest_data } = req.body;

    if (typeof quest_id !== 'string') return res.status(400).json({ message: 'Bad request.' });

    const dbInstance = Database.getInstance();
    const db = await dbInstance.getDb();
    const client = dbInstance.getClient();
    const configCollection = db.collection('config');
    const dashLogCollection = db.collection('dash-logs');

    const session = client.startSession({
        defaultTransactionOptions: {
            readConcern: { level: 'local' },
            writeConcern: { w: 1 },
            retryWrites: false
        }
    });

    try {
        await session.withTransaction(async () => {
            const [update_result, log_result] = await Promise.all([
                configCollection.updateOne(
                    { config_type: 'game_onetime_quests', [`quests.${quest_id}`]: { $exists: false } },
                    { $set: { [`quests.${quest_id}`]: quest_data } },
                    { session }
                ),
                dashLogCollection.insertOne({ log_type: 'quest/add', tele_id: req.tele_user.tele_id, quest_id, quest_data, created_at: new Date() }, { session }),
            ]);

            if (update_result.modifiedCount === 0) throw new Error('Quest ID already exists.');

            if (log_result.acknowledged !== true) throw new Error('Failed to update quest.');
        });

        res.status(200).send('OK');
    } catch (error: any) {
        if (error?.message === 'Quest ID already exists.') {
            return res.status(400).json({ message: error.message });
        };

        if (!res.headersSent) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error.' });
        };
    } finally {
        await session.endSession();
    };
}

export default function (req: NextApiRequest, res: NextApiResponse) {
    return telegramWebappMiddleware(req, res, handler);
}

export const config = { api: { responseLimit: '1mb' } };