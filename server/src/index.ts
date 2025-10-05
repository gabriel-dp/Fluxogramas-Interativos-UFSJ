import express from "express";

// Enable enviroment variables
import dotenv from "./lib/dotenv";
dotenv.config();

import configApp from "./configs/index";
import { log } from "./utils/log.utils";

// Starts server after config
log.info(`Starting server...`);
const app = express();
void configApp(app).then(() => {
	app.listen(process.env.SERVER_PORT, () => {
		log.info(`Listening on port ${process.env.SERVER_PORT ?? "???"}...`);
	});
});

export default app;
