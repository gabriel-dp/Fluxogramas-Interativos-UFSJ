import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "@/database/connectDB";
import coursesRouter from "@/routers/course.router";

// Enable enviroment variables
dotenv.config();

// Config express app
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/courses", coursesRouter);

// Starts server after connect to database
connectDB().then(() => {
	app.listen(process.env.PORT, () => {
		console.log(`Listening on port ${process.env.PORT}`);
	});
});
