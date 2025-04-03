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
        console.error('Erro ao contar matches:', error.message);
        return null;
    }
    
    return count;
}

export async function getStatistics() {
    try {
        const now = new Date();
        const currentMonthNumber = now.getMonth() + 1; // Janeiro = 0, então somamos 1
        const currentYearNumber = now.getFullYear();
        
        const [totalUsers, totalMatches, matchesQuery] = await Promise.all([
            getUserCount(),
            getMatchCount(),
            supabase
                .from('matches')
                .select('', { count: 'exact', head: true }) // Apenas conta os registros
                .filter('date', 'gte', `${currentYearNumber}-${String(currentMonthNumber).padStart(2, '0')}-01`)
                .filter('date', 'lt', `${currentYearNumber}-${String(currentMonthNumber + 1).padStart(2, '0')}-01`)
        ]);

        if (matchesQuery.error) {
            console.error('Erro na consulta do Supabase:', matchesQuery.error);
            throw new Error(matchesQuery.error.message);
        }

        const matchesThisMonth = matchesQuery.count ?? 0;
        
        const statistics = {
            totalUsers,
            totalMatches,
            matchesThisMonth,
            totalFee: (totalMatches ?? 0) * 1,
            monthlyFee: matchesThisMonth * 1
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



