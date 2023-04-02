import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./database/connectDB";
import coursesRouter from "./routers/course.router";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/courses", coursesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
