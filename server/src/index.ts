import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import userRouter from "./routers/user.router";

// Enable enviroment variables
dotenv.config();

// Config express app
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/user", userRouter);

// Starts server after connect to database
app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
