import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getStatisticsController, resetAdminBalance } from "../controllers/adminController";


const adminRouter = express.Router();

adminRouter.get("/get-statistics", authMiddleware, getStatisticsController);
adminRouter.put("/zerar-balance-admin", authMiddleware, resetAdminBalance);

export default adminRouter