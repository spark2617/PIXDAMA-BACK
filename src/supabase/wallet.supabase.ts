import { supabase } from "../config/supabase";

export const updateBalance = async (userId: number, amount: number) => {
  const { data, error } = await supabase.rpc('update_balance', {
    user_id: userId,
    amount: amount
  });

  if (error) {
    console.error('Erro ao atualizar saldo:', error.message);
    return { error: error.message };
  }

  return { success: true, data };
};


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

export const findWalletByUserId = async (user_id: number | string) => {
  const { data, error } = await supabase
    .from('wallet')
    .select()
    .eq("iduser", user_id)
    .single();

  return { data, error }
}