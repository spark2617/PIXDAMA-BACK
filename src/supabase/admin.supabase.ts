import { supabase } from "../config/supabase";

async function getUserCount() {
    const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
    
    if (error) {
        console.error('Erro ao contar usuários:', error.message);
        return null;
    }
    
    return count;
}

async function getMatchCount() {
    const { count, error } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true });
    
    if (error) {
        console.error('Erro ao contar partidas:', error.message);
        return null;
    }
    
    return count;
}

async function getBalanceAdmin() {
    const { data, error } = await supabase
        .from('wallet_admin')
        .select('balance')
        .limit(1)
        .single();

    if (error) {
        console.error('Erro ao buscar saldo da wallet_admin:', error.message);
        return null;
    }

    return data.balance;
}

export async function getStatistics() {
    try {
        const now = new Date();
        const currentMonthNumber = now.getMonth() + 1;
        const currentYearNumber = now.getFullYear();

        const [totalUsers, totalMatches, matchesThisMonthResult, totalFee] = await Promise.all([
            getUserCount(),
            getMatchCount(),
            supabase
                .from('matches')
                .select('*', { count: 'exact', head: true })
                .gte('date', `${currentYearNumber}-${String(currentMonthNumber).padStart(2, '0')}-01`)
                .lt('date', `${currentYearNumber}-${String(currentMonthNumber + 1).padStart(2, '0')}-01`),
            getBalanceAdmin()
        ]);

        if (matchesThisMonthResult.error) {
            console.error('Erro na consulta de partidas do mês:', matchesThisMonthResult.error);
            throw new Error(matchesThisMonthResult.error.message);
        }

        const matchesThisMonth = matchesThisMonthResult.count ?? 0;

        const statistics = {
            totalUsers,
            totalMatches,
            matchesThisMonth,
            totalFee,
            monthlyFee: matchesThisMonth * 1, // Ajuste conforme taxa real
        };

        console.log('Estatísticas calculadas:', statistics);
        return statistics;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erro ao buscar estatísticas:', error.message, error.stack);
        } else {
            console.error('Erro desconhecido ao buscar estatísticas:', error);
        }
        return null;
    }
}


export async function updateAdminBalance(amount: number): Promise<boolean> {
    try {
        // Primeiro busca o balance atual
        const { data, error: fetchError } = await supabase
            .from('wallet_admin')
            .select('id, balance')
            .limit(1)
            .single();

        if (fetchError || !data) {
            console.error("Erro ao buscar saldo atual:", fetchError?.message);
            return false;
        }

        const newBalance = (data.balance || 0) + amount;

        // Atualiza com o novo valor somado
        const { error: updateError } = await supabase
            .from('wallet_admin')
            .update({ balance: newBalance })
            .eq('id', data.id);

        if (updateError) {
            console.error("Erro ao atualizar saldo do admin:", updateError.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Erro inesperado ao atualizar saldo:", err);
        return false;
    }
}
