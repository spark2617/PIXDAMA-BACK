import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes';

import paymentRouter from "./routes/paymentRoutes";
import adminRouter from "./routes/adminRoutes";


const cors = require('cors');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
    origin: "https://pix-dama-front-pxbn.vercel.app/",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use((req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});