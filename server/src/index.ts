import express from "express";

// Enable enviroment variables
import dotenv from "@/lib/dotenv";
dotenv.config();

import configApp from "@/configs";
import { log } from "@/utils/log.utils";

// Starts server after config
log.info(`Starting server...`);
const app = express();
configApp(app).then(() => {
	app.listen(process.env.PORT, () => {
		log.info(`Listening on port ${process.env.PORT}...`);
	});
});

export default app;
