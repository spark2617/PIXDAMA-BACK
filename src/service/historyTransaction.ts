import { body } from "express-validator";
import { getTransactionsByUserId, registerTransaction, Transaction } from "../supabase/historyTransaction";
import { getWalletByUserId, updateWalletBalance } from "../supabase/wallet.supabase";

type TransactionType = 'Deposito' | 'Saque';

interface Body {
    type: TransactionType;
    value: number;
    user_id: string | number;

}

export class TransactionService {
    static async registerTransaction({ user_id, value, type }: Body) {

        const wallet = await getWalletByUserId(user_id)

        const balance = wallet.balance

        const newBalance: number = balance + value

        await updateWalletBalance(user_id, newBalance)

        await registerTransaction({ type, value, user_id, balance: newBalance });

    }

    static async findTransactionByIdUser(user_id: string): Promise<Transaction[]> {
        return await getTransactionsByUserId(user_id);
    }
}