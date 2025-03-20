import { Request } from "express";
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const EXPIRATION_TIME = "1h";

export interface UserTokenData {
	id: number;
	isAdmin: boolean;
}

export interface AuthRequest extends Request {
	user?: UserTokenData;
}

export async function encryptPassword(password: string): Promise<string> {
	return hash(password, 10);
}

export async function validatePassword(password: string, hash: string) {
	return compare(password, hash);
}

export function generateToken(userData: UserTokenData) {
	if (!secret) throw new Error("Secret not defined");

	const token = sign(userData, secret, { expiresIn: EXPIRATION_TIME });
	return token;
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
