import { supabase } from "../config/supabase";


export async function updateWalletBalance(userId:string | number, amount: number) {
  try {
    // Buscar o saldo atual do usuário
    const { data: userWallet, error: fetchError } = await findWalletByUserId(userId)

    if (fetchError) {
      console.error('Erro ao buscar saldo:', fetchError.message);
      return { error: fetchError.message };
    }

    
    const newBalance = userWallet.balance + amount;

    
    const { data, error } = await supabase
      .from('wallet')
      .update({ balance: newBalance })
      .eq('iduser', userId)
      .select();

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

export const findWalletByUserId = async (user_id: number | string) => {
  const { data, error } = await supabase
    .from('wallet')
    .select()
    .eq("iduser", user_id)
    .single();

  return { data, error }
}