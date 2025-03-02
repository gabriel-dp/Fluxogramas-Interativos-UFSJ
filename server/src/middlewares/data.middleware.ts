import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

export function validateData(schema: AnyZodObject) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				res.sendStatus(404);
			} else {
				res.sendStatus(500);
			}
		}
	};
}

export function validateId(req: Request, res: Response, next: NextFunction) {
	const id = req.params.id;
	if (id == undefined) return res.sendStatus(400);
	if (isNaN(Number(id))) return res.sendStatus(400);
	next();
}
