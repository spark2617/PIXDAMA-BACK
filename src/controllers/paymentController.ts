import { payment } from '../config/mercadoPago';
import { Request, Response } from 'express';
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes.js";
import { findUserIdByEmailAndCpf, updateBalance } from '../services/supabaseService';

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { title, price, payerEmail, cpf } = req.body;

        const body = {
            transaction_amount: Number(price),
            description: title,
            payment_method_id: "pix",
            payer: {
                email: payerEmail,
                identification: {
                    type: "CPF",
                    number: cpf
                }
            },


        };

        const response: PaymentResponse = await payment.create({ body });

        res.json({
            qrcode: response.point_of_interaction?.transaction_data?.qr_code_base64,
            evmCode: response.point_of_interaction?.transaction_data?.qr_code
        });
    } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        res.status(500).json({ error: "Erro ao processar pagamento" });
    }
};

export const webhookHandler = async (req: Request, res: Response) => {
    console.log("🔔 Webhook recebido:", req.body);
  
    // try {
    
    //   const paymentData = req.body;
  
    //   if (!paymentData || !paymentData.data || !paymentData.data.id) {
    //     return res.status(400).json({ error: "Dados inválidos no webhook" });
    //   }
  

    //   if (paymentData.status !== "approved") {
    //     return res.status(400).json({ error: "Pagamento não aprovado" });
    //   }
  
    //   const { transaction_amount, payer } = paymentData;
    //   const { email, identification } = payer;
    //   const cpf = identification.number;
  
      
    //   const userId = await findUserIdByEmailAndCpf(email, cpf);
    //   if (!userId) {
    //     return res.status(404).json({ error: "Usuário não encontrado" });
    //   }
  
      
    //   const updateResult = await updateBalance(userId, transaction_amount);
    //   if (updateResult.error) {
    //     return res.status(500).json({ error: "Erro ao atualizar saldo" });
    //   }
  
    //   console.log(`✅ Saldo atualizado para o usuário ${userId}: +${transaction_amount}`);
    //   res.sendStatus(200);
    // } catch (error) {
    //   console.error("Erro no webhook:", error);
    //   res.status(500).json({ error: "Erro interno do servidor" });
    // }
  };
