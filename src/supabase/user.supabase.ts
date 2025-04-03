import { supabase } from "../config/supabase";

export const findUserIdByid = async (id: number | string) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single()


    return {
        data,
        error
    };
};

export const findUserByEmail = async (email: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    
        return {
            data,
            error
        };

}

export const createUserSupabase = async (name: string, email: string, password: string, cpf: string, birthdate: string, confirmou_dados: boolean, confirmou_idade: boolean, aceitou_termos: boolean) => {
    const { data, error } = await supabase
        .from('users')
        .insert([
            {
                name,
                email,
                password,
                cpf,
                birthdate,
                confirmou_dados,
                confirmou_idade,
                aceitou_termos,
            }
        ])
        .select()
        .single();

        return {data, error}
}

