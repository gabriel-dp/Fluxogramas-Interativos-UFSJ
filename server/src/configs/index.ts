import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { requestLog } from "../middlewares/logs.middleware";
import router from "./routes.config";
import databaseConfig from "./database.config";

export default async function configApp(app: Express): Promise<void> {
	app.use(express.json());
	app.use(cookieParser());
	app.use(cors({ origin: process.env.SERVER_CORS_ORIGIN, credentials: true }));
	app.use(requestLog);
	app.use(router);

	await databaseConfig();
}
