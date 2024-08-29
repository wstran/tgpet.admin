import { NextApiRequest, NextApiResponse } from "next";
import telegramWebappMiddleware from "@/middlewares/telegram-webapp";
import Database from "@/libs/database";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed.' });

    const dbInstance = Database.getInstance();
    const db = await dbInstance.getDb();
    const analystCollection = db.collection("analysts");

    const analyst = await analystCollection.find({ analyst_type: 'analyst_users' }, { projection: { _id: 0 } }).sort({ updated_at: -1 }).limit(2).toArray();

    const last_active_1h_percent = (analyst[0] && analyst[1]) ? (analyst[0].last_active_1h_users - analyst[1].last_active_1h_users) / analyst[1].last_active_1h_users * 100 : 0;
    const last_active_3h_percent = (analyst[0] && analyst[1]) ? (analyst[0].last_active_3h_users - analyst[1].last_active_3h_users) / analyst[1].last_active_3h_users * 100 : 0;
    const last_active_6h_percent = (analyst[0] && analyst[1]) ? (analyst[0].last_active_6h_users - analyst[1].last_active_6h_users) / analyst[1].last_active_6h_users * 100 : 0;
    const last_active_12h_percent = (analyst[0] && analyst[1]) ? (analyst[0].last_active_12h_users - analyst[1].last_active_12h_users) / analyst[1].last_active_12h_users * 100 : 0;
    const new_users_percent = (analyst[0] && analyst[1]) ? (analyst[0].new_users - analyst[1].new_users) / analyst[1].new_users * 100 : 0;
    const total_borrowed_users_percent = (analyst[0] && analyst[1]) ? (analyst[0].total_borrowed_users - analyst[1].total_borrowed_users) / analyst[1].total_borrowed_users * 100 : 0;
    const total_tgpet_borrowed_amount_percent = (analyst[0] && analyst[1]) ? (analyst[0].total_tgpet_borrowed_amount - analyst[1].total_tgpet_borrowed_amount) / analyst[1].total_tgpet_borrowed_amount * 100 : 0;
    const total_tgpet_repayed_amount_percent = (analyst[0] && analyst[1]) ? (analyst[0].total_tgpet_repayed_amount - analyst[1].total_tgpet_repayed_amount) / analyst[1].total_tgpet_repayed_amount * 100 : 0;
    const total_users_percent = (analyst[0] && analyst[1]) ? (analyst[0].total_users - analyst[1].total_users) / analyst[1].total_users * 100 : 0;

    if (analyst === null) return res.status(500).json({ message: 'Internal server error.' });

    res.status(200).json({
        ...analyst[0],
        last_active_1h_percent,
        last_active_3h_percent,
        last_active_6h_percent,
        last_active_12h_percent,
        new_users_percent,
        total_borrowed_users_percent,
        total_tgpet_borrowed_amount_percent,
        total_tgpet_repayed_amount_percent,
        total_users_percent,
    });
}

export default function (req: NextApiRequest, res: NextApiResponse) {
    return telegramWebappMiddleware(req, res, handler);
}

export const config = { api: { responseLimit: '1mb' } };