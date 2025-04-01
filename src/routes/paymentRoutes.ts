import express from "express";
import { cashIn, cashOut, webhookHandler } from "../controllers/paymentController";
import { authMiddleware } from "../middleware/auth.middleware";
import { createCashinSchema, createCashOutSchema } from "../validate/payment.schema";
import { validateRequest } from "../middleware/validateRequest";

const paymentRouter = express.Router();

paymentRouter.post("/cash-in", createCashinSchema, validateRequest, authMiddleware, cashIn);
paymentRouter.post("/cash-out", createCashOutSchema, validateRequest, authMiddleware, cashOut);

paymentRouter.post("/webhook", webhookHandler);

export default paymentRouter;
