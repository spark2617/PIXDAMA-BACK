import express from "express";
import { createPayment, webhookHandler } from "../controllers/paymentController";
import { paymentSchema } from "../validate/paymentValidator";
import { validate } from "../middleware/validateZod";

const paymentRouter = express.Router();

paymentRouter.post("/payment",validate(paymentSchema), createPayment);
paymentRouter.post("/webhook", webhookHandler);

export default paymentRouter;
