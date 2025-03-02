import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export interface UserTokenData {
	id: number;
	isAdmin: boolean;
}

export interface AuthRequest extends Request {
	user?: UserTokenData;
}

const secret = process.env.JWT_SECRET;

export const getAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	if (!token) return res.sendStatus(401);
	if (!secret) return res.sendStatus(500);

	try {
		const verified = verify(token, secret) as UserTokenData;
		req.user = {
			id: verified.id,
			isAdmin: verified.isAdmin,
		};
	} catch (error) {
		req.user = undefined;
	}

	next();
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) =>
	await getAuth(req, res, async () => {
		if (!req.user) return res.sendStatus(403);
		next();
	});

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
	await requireAuth(req, res, async () => {
		if (!req.user?.isAdmin) return res.sendStatus(403);
		next();
	});
};
