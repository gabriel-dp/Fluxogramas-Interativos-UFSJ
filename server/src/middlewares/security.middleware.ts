import { NextFunction, Response } from "express";

import { AuthRequest, getDataFromAccessToken, getToken, isAdministrator, isAuthenticated } from "#src/utils/auth.utils";

export const getAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
	req.user = undefined; // Clear any user data on request

	try {
		const token = getToken(req);
		if (token) {
			req.user = getDataFromAccessToken(token);
		}
	} catch (error) {
		return res.sendStatus(500);
	}

	next();
};

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) =>
	void getAuth(req, res, () => {
		if (!isAuthenticated(req)) return res.sendStatus(401);
		next();
	});

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) =>
	requireAuth(req, res, () => {
		if (!isAdministrator(req)) return res.sendStatus(403);
		next();
	});
