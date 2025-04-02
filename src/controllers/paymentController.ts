import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createCashOut, createTransaction } from '../connectionPay/paymentsService';
import { createCashInSupabase, findCashInByExternal_id, updateCashInSupabase } from '../supabase/cashIn.supabase';
import { verifyIP } from '../utils/ValidationWebHook';
import { getBalancetByUserId, getWalletByUserId, updateWalletBalance } from '../supabase/wallet.supabase';
import { TransactionService } from '../service/historyTransaction';


export const cashIn = async (req: Request, res: Response) => {
    try {
        const external_id = uuidv4();
        const ip = req.ip;
        const user = (req as any).user;
        const { amount } = req.body;

        // Criar transação de pagamento
        const response = await createTransaction(
            external_id,
            amount,
            ip,
            user.name,
            user.email,
            user.cpf
        );


        // Criar registro no Supabase
        const { data: cashIn, error: cashInError } = await createCashInSupabase(
            external_id,
            amount,
            user.userId
        );

        if (cashInError) {
            console.error("Error saving cash-in to Supabase:", cashInError);
            throw new Error("Failed to save cash-in data");
        }

        res.status(201).json({ ...cashIn, pix: response.pix.payload });
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const webhookHandler = async (req: Request, res: Response) => {
    try {

        if (!verifyIP(req)) {
            res.status(403).json({ error: "Acesso não autorizado" });
            return
        }

        const { external_id, status } = req.body;

        if (!external_id || !status) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        const getCash_in = await findCashInByExternal_id(external_id)

        if(getCash_in.data.status === "AUTHORIZED"){
            res.status(200).json({
                success: true,
                status: "OK",
            });
            return
        }
        const { data: cashIn, error: cashInError } = await updateCashInSupabase(external_id, status);

        if (cashInError) {
            console.error("Erro ao atualizar cash-in no Supabase:", cashInError);
            res.status(500).json({ error: "Failed to update cash-in data" });
            return;
        }

        const cashInSupabase = await findCashInByExternal_id(external_id);

        if (!cashInSupabase.data) {
            console.error("Erro: Cash In não encontrado.");
            res.status(404).json({ error: "Cash In not found" });
            return;
        }

        const { iduser, amount }: any = cashInSupabase.data;

        await TransactionService.registerTransaction({
            user_id: iduser,
            value: amount,
            type: "Deposito",
        });

        res.status(200).json({
            success: true,
            status: "OK",
        });

    } catch (error) {
        console.error("Erro no webhookHandler:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const cashOut = async (req: Request, res: Response) => {
    try {
        const { pix_key, pix_type, amount } = req.body;
        const user = (req as any).user;


        const wallet = await getWalletByUserId(user.userId);

        if (!wallet || wallet.balance < amount) {
            console.error("Saldo insuficiente.");
            res.status(400).json({ error: "Saldo insuficiente na carteira" });
            return;
        }

        const response = await createCashOut(pix_key, pix_type, amount);

        if (response.hasError) {
            console.error("Erro ao criar Cash Out:", response.error);
            res.status(400).json({ error: response.error });
            return;
        }

        const balanceError = await updateWalletBalance(user.userId, -(amount));

        if (!balanceError) {
            console.error("Erro ao atualizar saldo:", balanceError);
            res.status(500).json({ error: "Failed to update balance" });
            return;
        }


        res.status(200).json({
            success: true,
            message: "Cash Out created successfully",
        });

    } catch (error) {
        console.error("Erro no cashOut:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getUserTransactions = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const transactions = await TransactionService.findTransactionByIdUser(user.userId);

        // if (transactions.length === 0) {
        //     res.status(404).json({ message: "No transactions found for this user." });
        //     return
        // }

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getBalance = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user; 

        const balance = await getBalancetByUserId(user.userId);

        res.status(200).json(balance);
    } catch (error) {
        console.error("Erro ao buscar saldo:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};