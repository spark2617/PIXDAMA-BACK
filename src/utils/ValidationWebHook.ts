import { Request, Response } from 'express';
import crypto from "crypto";
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.ACCESS_TOKEN as string

export const isSignatureValid = (req:Request, res:Response)=>{
    const signature = req.headers["x-signature"] as string;
    console.log(JSON.stringify(req.headers, null, 2))
    const payload = JSON.stringify(req.body);
    console.log(signature)
    // Calcula a assinatura esperada
    const expectedSignature = crypto
        .createHmac("sha256", SECRET)
        .update(payload)
        .digest("hex");
    console.log(expectedSignature)
    return signature === expectedSignature
}