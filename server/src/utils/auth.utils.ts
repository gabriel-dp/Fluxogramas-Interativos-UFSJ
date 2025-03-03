import { Request } from "express";
import { verify } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export interface UserTokenData {
	id: number;
	isAdmin: boolean;
}

export interface AuthRequest extends Request {
	user?: UserTokenData;
}

export function getToken(req: Request): string | undefined {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];

	return token;
}

export function getDataFromToken(token: string) {
	if (!secret) throw new Error("Secret not defined");

	try {
		const verified = verify(token, secret) as UserTokenData;
		return {
			id: verified.id,
			isAdmin: verified.isAdmin,
		};
	} catch (error) {
		return undefined;
	}
}

export function isAuthenticated(req: AuthRequest) {
	return req.user != undefined;
}

export function isAdministrator(req: AuthRequest) {
	return req.user?.isAdmin;
}
