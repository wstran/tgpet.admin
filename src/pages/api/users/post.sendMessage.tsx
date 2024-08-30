import { NextApiRequest, NextApiResponse } from "next";
import telegramWebappMiddleware, { RequestWithUser } from "@/middlewares/telegram-webapp";
import Database from "@/libs/database";

type Message = { is_test: boolean, message: string, photo: string, buttons: { text: string, url: string }[][] };

const handler = async (req: RequestWithUser, res: NextApiResponse) => {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed.' });

    const { is_test, message, photo, buttons } = req.body as Message;

    if (typeof message !== 'string') return res.status(400).json({ message: 'Bad request.' });

    const dbInstance = Database.getInstance();
    const db = await dbInstance.getDb();
    const client = dbInstance.getClient();
    const userCollection = db.collection('users');
    const todoCollection = db.collection('todos');
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
            const now_date = new Date();

            if (is_test === true) {
                const [update_result, log_result] = await Promise.all([
                    todoCollection.insertOne({
                        todo_type: 'bot:send/tele/message',
                        message_type: 'admin:sendMessage',
                        tele_id: req.tele_user.tele_id,
                        created_at: now_date,
                        status: "pending",
                        is_test: true,
                        is_channel: true,
                        bot: 'tgpet_app_bot',
                        target_id: '-1002199986770',
                        message: message,
                        ...(photo && { photo }),
                        ...({ ...(buttons && buttons.length > 0) && { buttons: buttons } })
                    }),
                    dashLogCollection.insertOne({ log_type: 'admin/sendMessage', tele_id: req.tele_user.tele_id, ...req.body, created_at: now_date }, { session }),
                ]);

                if (update_result.acknowledged !== true || log_result.acknowledged !== true) throw new Error('Failed to update quest. (1)');
            } else {
                const users = await userCollection.find().project({ _id: 0, tele_id: 1 }).toArray();

                const bulkOps: any[] = [];

                for (let i = 0; i < users.length; ++i) {
                    bulkOps.push({
                        insertOne: {
                            document: {
                                todo_type: 'bot:send/tele/message',
                                message_type: 'admin:sendMessage',
                                tele_id: req.tele_user.tele_id,
                                created_at: now_date,
                                status: "pending",
                                bot: 'tgpet_app_bot',
                                target_id: users[i].tele_id,
                                message: message,
                                ...(photo && { photo }),
                                ...({ ...(buttons && buttons.length > 0) && { buttons: buttons } })
                            }
                        }
                    });
                };

                const [message_result, log_result] = await Promise.all([
                    todoCollection.bulkWrite(bulkOps, { session }),
                    dashLogCollection.insertOne({ log_type: 'admin/sendMessage', tele_id: req.tele_user.tele_id, ...req.body, created_at: now_date }, { session }),
                ]);

                if (message_result.isOk() || log_result.acknowledged !== true) throw new Error('Failed to update quest. (2)');
            };
        });

        res.status(200).send('OK');
    } catch (error) {
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