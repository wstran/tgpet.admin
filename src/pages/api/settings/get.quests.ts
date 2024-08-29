import { NextApiRequest, NextApiResponse } from "next";
import telegramWebappMiddleware from "@/middlewares/telegram-webapp";
import Database from "@/libs/database";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed.' });

    const dbInstance = Database.getInstance();
    const db = await dbInstance.getDb();
    const configCollection = db.collection('config');

    const config = await configCollection.findOne({ config_type: 'game_onetime_quests' }, { projection: { _id: 0, quests: 1 } });

    if (config === null) return res.status(500).json({ message: 'Internal server error.' });

    res.status(200).json(config.quests || {});
}

export default function (req: NextApiRequest, res: NextApiResponse) {
    return telegramWebappMiddleware(req, res, handler);
}

export const config = { api: { responseLimit: '1mb' } };