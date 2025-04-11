import { getStatistics } from "../supabase/admin.supabase";
import { Request, Response } from 'express';
import { supabase } from "../config/supabase";

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


export async function resetAdminBalance(req: Request, res: Response) {
    try {
        const { error } = await supabase
            .from('wallet_admin')
            .update({ balance: 0 })
            .eq('id', 1);

        if (error) {
            console.error("Erro ao zerar o saldo do admin:", error.message);
            res.status(500).json({ error: "Erro ao zerar saldo" });
        }

        res.status(200).json({ message: "Saldo zerado com sucesso" });
    } catch (err) {
        console.error("Erro interno:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}