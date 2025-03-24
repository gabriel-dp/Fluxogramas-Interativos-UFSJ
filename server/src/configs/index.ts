import express, { Express } from "express";
import cors from "cors";

import { requestLog } from "@/middlewares/logs.middleware";

import router from "./routes.config";
import databaseConfig from "./database.config";

export default async function configApp(app: Express): Promise<void> {
	app.use(express.json());
	app.use(cors());
	app.use(requestLog);
	app.use(router);

	await databaseConfig();
}
