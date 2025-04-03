import { getStatistics } from "../supabase/admin.supabase";
import { Request, Response } from 'express';

export const getStatisticsController = async (req: Request, res: Response) => {
    try {
        const stats = await getStatistics();
        if (!stats) {
            res.status(500).json({ error: 'Erro ao buscar estatísticas' });
            return
        }
        res.json(stats);
    } catch (error) {
        console.error('Erro no controller:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}