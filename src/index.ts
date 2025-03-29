import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes';

import paymentRouter from "./routes/paymentRoutes";


const cors = require('cors');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRouter);
app.use("/api", paymentRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});