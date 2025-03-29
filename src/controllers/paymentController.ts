import { payment } from '../config/mercadoPago';
import { Request, Response } from 'express';
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes.js";

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
    res.status(200)
  };
