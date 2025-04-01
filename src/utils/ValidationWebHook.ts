import { Request, Response } from 'express';
import crypto from "crypto";
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.ACCESS_TOKEN as string

export const isSignatureValid = (req:Request, res:Response)=>{
    const signature = req.headers["x-signature"] as string;
    const payload = JSON.stringify(req.body);
    
    // Calcula a assinatura esperada
    const expectedSignature = crypto
        .createHmac("sha256", SECRET)
        .update(payload)
        .digest("hex");

    return signature === expectedSignature
}