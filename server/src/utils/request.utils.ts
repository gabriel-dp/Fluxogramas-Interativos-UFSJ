import { Request } from "express";

export function getId(req: Request): number | undefined {
	const id = req.params.id;
	if (id == undefined || isNaN(Number(id))) return undefined;
	return Number(id);
}
