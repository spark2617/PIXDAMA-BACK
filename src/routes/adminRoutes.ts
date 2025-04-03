import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getStatisticsController } from "../controllers/adminController";


const adminRouter = express.Router();

adminRouter.get("/get-statistics", authMiddleware, getStatisticsController);

export default adminRouter