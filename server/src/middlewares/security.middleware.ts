import { NextFunction, Response } from "express";

import { AuthRequest, getDataFromToken, getToken, isAdministrator, isAuthenticated } from "@/utils/auth.utils";

export const getAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
	req.user = undefined; // Clear any user data on request

	try {
		const token = getToken(req);
		if (token) {
			req.user = getDataFromToken(token);
		}
	} catch (error) {
		return res.sendStatus(500);
	}

	next();
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) =>
	getAuth(req, res, async () => {
		if (!isAuthenticated(req)) return res.sendStatus(401);
		next();
	});

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) =>
	requireAuth(req, res, async () => {
		if (!isAdministrator(req)) return res.sendStatus(403);
		next();
	});
