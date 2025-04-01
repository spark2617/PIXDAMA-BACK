import { supabase } from "../config/supabase";


export const createCashOutSupabase = async (amount: number, user_id: number | string,) => {
    const {data, error } = await supabase
        .from('cash_out')
        .insert([
            {
                amount,
                iduser: user_id
            }
        ])
        .select()
        .single();

    return { data, error }
}
