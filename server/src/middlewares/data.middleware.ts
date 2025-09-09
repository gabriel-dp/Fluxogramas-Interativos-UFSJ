import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

import { log } from "#src/utils/log.utils";
import { getPossibleId } from "#src/utils/request.utils";

export function validateData(schema: AnyZodObject) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			req.body = schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				log.debug(error.issues);
				res.sendStatus(400);
			} else {
				res.sendStatus(500);
			}
		}
	};
}

export function validateId(req: Request, res: Response, next: NextFunction) {
	const id = getPossibleId(req);
	if (!id) return res.sendStatus(400);
	next();
}
