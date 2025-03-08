import { NextFunction, Request, Response } from "express";

const PROTECTED_FIELDS = ["password", "token"];

export function requestLog(req: Request, res: Response, next: NextFunction) {
	console.log(req.method, req.originalUrl);

	const body = { ...req.body };
	PROTECTED_FIELDS.forEach((field) => {
		if (field in body) {
			body[field] = "...";
		}
	});
	console.log(body);

	res.on("finish", () => {
		console.log(`Response: ${res.statusCode}, ${res.statusMessage}`, "\n");
	});

	next();
}
