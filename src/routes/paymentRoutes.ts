import express from "express";
import { cashIn, cashOut, getBalance, getUserTransactions, webhookHandler } from "../controllers/paymentController";
import { authMiddleware } from "../middleware/auth.middleware";
import { createCashinSchema, createCashOutSchema } from "../validate/payment.schema";
import { validateRequest } from "../middleware/validateRequest";

const paymentRouter = express.Router();

paymentRouter.post("/cash-in", createCashinSchema, validateRequest, authMiddleware, cashIn);

paymentRouter.post("/cash-out", createCashOutSchema, validateRequest, authMiddleware, cashOut);
paymentRouter.get("/history-transactios", authMiddleware, getUserTransactions);
paymentRouter.get("/balance-user", authMiddleware, getBalance);
paymentRouter.post("/webhook", webhookHandler);

export default paymentRouter;
