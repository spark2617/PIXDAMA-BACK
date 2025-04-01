import { supabase } from "../config/supabase";


export const createCashOutSupabase = async (external_id: string, amount: number, user_id: number | string, status: string) => {
    const {data, error } = await supabase
        .from('cash_out')
        .insert([
            {
                external_id,
                status,
                amount,
                iduser: user_id
            }
        ])
        .select()
        .single();

    return { data, error }
}
