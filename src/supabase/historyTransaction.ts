import { supabase } from "../config/supabase";



export const registerTransaction = async (user_id: string | number, value: number, type:'Deposito' | 'Saque') => {
    const { data, error } = await supabase
        .from('history_transactions')
        .insert({ user_id, value, type })
        .select('*');

    if (error) {
        throw new Error(`Error inserting transaction: ${error.message}`);
    }

    return data;
};

export const getTransactionsByUserId = async (user_id: string | number) => {
    const { data, error } = await supabase
        .from('history_transations')
        .select('*')
        .eq('user_id', user_id);

    if (error) {
        throw new Error(`Error fetching transactions: ${error.message}`);
    }

    return data;
};