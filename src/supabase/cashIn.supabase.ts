import { supabase } from "../config/supabase";

export const createCashInSupabase = async (external_id: string, amount: number, user_id: number | string) => {
    const { data, error } = await supabase
        .from('cash_in')
        .insert([
            {
                external_id,
                amount,
                iduser: user_id
            }
        ])
        .select()
        .single();

    return { data, error }
}

export const updateCashInSupabase = async (external_id: string, status: string) => {
    const { data, error } = await supabase
        .from("cash_in")
        .update({
            status,
        })
        .eq("external_id", external_id)

    return { data, error }
}

export const findCashInByExternal_id = async (external_id:string) => {
    const { data, error } = await supabase
        .from("cash_in")
        .select()
        .eq("external_id", external_id)

    return { data, error }
}