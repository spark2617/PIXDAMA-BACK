import { supabase } from "../config/supabase";


export async function updateWalletBalance(userId:string | number, amount: number) {
  try {
    const { data, error } = await supabase
      .from('wallet')
      .update({ balance: amount })
      .eq('iduser', userId)

    if (error) {
      console.error('Erro ao atualizar saldo:', error.message);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Erro inesperado:', err);
    return { error: 'Erro interno do servidor' };
  }
}
export const createWalletSupabase = async (user_id: number | string) => {
  const { data, error } = await supabase
    .from('wallet')
    .insert([
      {
        iduser: user_id,
      }
    ])
    .select()
    .single();

  return { data, error }
}
export const getWalletByUserId = async (user_id: number | string) => {
  const { data, error } = await supabase
    .from('wallet')
    .select()
    .eq("iduser", user_id)
    .single();

  return data
}
export const getBalancetByUserId = async (user_id: number | string) => {
  const { data, error } = await supabase
    .from('wallet')
    .select("balance")
    .eq("iduser", user_id)
    .single();
  return data
}