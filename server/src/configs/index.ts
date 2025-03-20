import express, { Express } from "express";
import cors from "cors";

import { requestLog } from "@/middlewares/logs.middleware";

import routes from "./routes.config";
import authConfig from "./auth.config";

export default async function configApp(app: Express): Promise<void> {
	app.use(express.json());
	app.use(cors());
	app.use(requestLog);
	app.use(routes);

	await authConfig();
}
