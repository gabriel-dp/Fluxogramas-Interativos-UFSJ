import { NextFunction, Request, Response } from "express";

import { log } from "../utils/log.utils";

const PROTECTED_FIELDS = ["password", "token"];

export function requestLog(req: Request, res: Response, next: NextFunction) {
	const body = { ...req.body } as Record<string, unknown>;
	PROTECTED_FIELDS.forEach((field) => {
		if (field in body) {
			body[field] = "...";
		}
	});
	const requestData = `${req.method} ${req.originalUrl} ${JSON.stringify(body)}`;
	log.debug(requestData);

	res.on("finish", () => {
		if (res.errored) {
			log.error(`Server error - ${requestData}`);
		} else {
			log.debug(`Response: ${res.statusCode}, ${res.statusMessage}`);
		}
	});

	next();
}
