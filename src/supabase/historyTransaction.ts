import { supabase } from "../config/supabase";


type TransactionType = 'Deposito' | 'Saque';

export interface Transaction {
    type: TransactionType;
    value: number;
    user_id: string|number;
    balance: number;
}

export const registerTransaction = async (transaction: Transaction): Promise<Transaction[]> => {
    const { data, error } = await supabase
        .from('history_transactions')
        .insert([transaction])
        .select('*');
    
    if (error) {
        throw new Error(`Error inserting transaction: ${error.message}`);
    }
    
    return data;
};

export const getTransactionsByUserId = async (user_id: string|number): Promise<Transaction[]> => {
    const { data, error } = await supabase
        .from('history_transations')
        .select('*')
        .eq('user_id', user_id);
    
    if (error) {
        throw new Error(`Error fetching transactions: ${error.message}`);
    }
    
    return data;
};