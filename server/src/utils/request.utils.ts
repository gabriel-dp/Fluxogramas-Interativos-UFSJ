import { Request } from "express";

export function getPossibleId(req: Request): number | undefined {
	const { id } = req.params;
	if (id == undefined || isNaN(Number(id))) return undefined;
	return Number(id);
}

export function getId(req: Request): number {
	const { id } = req.params;
	return Number(id);
}
