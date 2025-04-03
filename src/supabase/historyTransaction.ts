import { supabase } from "../config/supabase";



export const registerTransaction = async (
    user_id: string | number, 
    value: number, 
    type: 'Deposito' | 'Saque', 
    balance: number
) => {
    try {
        const { data, error } = await supabase
            .from('history_transactions')
            .insert([{ user_id, value, type, balance }])
            .select()
            .single();

        if (error) {
            console.error("Erro ao registrar transação:", error.message);
            return null; 
        }
        

        return data;
    } catch (err) {
        console.error("Erro inesperado ao registrar transação:", err);
        return null;
    }
};


export const getTransactionsByUserId = async (user_id: string | number) => {
    const { data, error } = await supabase
        .from('history_transactions')
        .select('*')
        .eq('user_id', user_id);

    if (error) {
        throw new Error(`Error fetching transactions: ${error.message}`);
    }

    return data;
};