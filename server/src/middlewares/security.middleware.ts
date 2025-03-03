import { NextFunction, Response } from "express";

import { AuthRequest, getDataFromToken, getToken, isAdministrator, isAuthenticated } from "@/utils/auth.utils";

export const getAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const token = getToken(req);
		if (!token) return res.sendStatus(401);
		req.user = getDataFromToken(token);
	} catch (error) {
		return res.sendStatus(500);
	}

	next();
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) =>
	await getAuth(req, res, async () => {
		if (!isAuthenticated(req)) return res.sendStatus(403);
		next();
	});

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) =>
	await requireAuth(req, res, async () => {
		if (!isAdministrator(req)) return res.sendStatus(403);
		next();
	});
