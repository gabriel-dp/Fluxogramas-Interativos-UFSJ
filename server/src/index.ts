import express from "express";
import cors from "cors";

// Enable enviroment variables
import dotenv from "@/lib/dotenv";
dotenv.config();

import userRouter from "@/routers/user.router";
import authRouter from "@/routers/auth.router";
import defaultRouter from "@/routers/default.router";
import { requestLog } from "@/middlewares/logs.middleware";

// Config express app
const app = express();
app.use(express.json());
app.use(cors());

// Enable request logs
app.use(requestLog);

// Routes
app.use("/", defaultRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

// Starts server after connect to database
app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}...`, "\n");
});

export default app;
