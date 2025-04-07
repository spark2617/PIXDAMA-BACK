import dotenv from 'dotenv';

dotenv.config();

const token = process.env.ACCESS_TOKEN

export async function createTransaction(externalId: string, amount: number, ip: string| undefined, name: string, email: string, document: string,) {
    const requestData = {
        external_id: externalId,
        total_amount: amount,
        payment_method: "PIX",
        webhook_url: "https://pixdama-dabt.onrender.com/api/payments/webhook",
        items: [
            {
                id: "deposit",
                title: "Depósito na plataforma PIX-DAMA",
                description: "Adição de saldo na conta do usuário",
                price: amount,
                quantity: 1,
                is_physical: false,
            },
        ],
        ip,
        customer: {
            name: name,
            email: email,
            phone: "+5500000000000", // Sempre o mesmo telefone
            document_type: "CPF",
            document: document,
        },
    };

    try {
        const response = await fetch("https://api.connectpay.vc/v1/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-secret" : `${token}`
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`Erro ao criar pagamento: ${response}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao criar pagamento:", error);
        throw error;
    }
}

export const  createCashOut = async (pixKey: string, pixType: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "RANDOM", amount: number)=> {
    const url = "https://api.connectpay.vc/v1/cashout";

    const body = JSON.stringify({
        pix_key: pixKey,
        pix_type: pixType,
        amount: amount
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-secret" : `${token}`
            },
            body: body
        });

        return await response.json();

    } catch (error) {
        console.log(error)
    }

    
}