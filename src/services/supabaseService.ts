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


export const findUserIdByEmailAndCpf = async (email: string, cpf: string) => {
  const { data, error } = await supabase
    .from("user") 
    .select("id")
    .eq("email", email)
    .eq("cpf", cpf)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar o usuário:", error.message);
    return null;
  }

  return data?.id;
};

