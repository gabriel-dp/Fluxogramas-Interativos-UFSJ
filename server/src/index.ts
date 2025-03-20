import express from "express";

// Enable enviroment variables
import dotenv from "@/lib/dotenv";
dotenv.config();

// Base app config
import configApp from "@/configs";

// Config express app
const app = express();

// Starts server after config
configApp(app).then(() => {
	app.listen(process.env.PORT, () => {
		console.log(`Listening on port ${process.env.PORT}...`, "\n");
	});
});

export default app;
