import express from "express";
import cors from "cors";

import dotenv from "@/lib/dotenv";
import userRouter from "@/routers/user.router";
import authRouter from "@/routers/auth.router";
import defaultRouter from "@/routers/default.router";

// Enable enviroment variables
dotenv.config();

// Config express app
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/", defaultRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
	console.log(`Request URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`);
	next();
});

// Starts server after connect to database
app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});

export default app;
