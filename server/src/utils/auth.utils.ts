import { Request } from "express";
import { compare, hash } from "bcryptjs";
import { sign, SignOptions, verify } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: string | undefined = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET: string | undefined = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION: string | undefined = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_TOKEN_EXPIRATION: string | undefined = process.env.REFRESH_TOKEN_EXPIRATION;

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

export async function validatePassword(password: string, hash: string): Promise<boolean> {
	return compare(password, hash);
}

export async function encryptToken(token: string): Promise<string> {
	return hash(token, 10);
}

export async function validateToken(token: string, hash: string): Promise<boolean> {
	return compare(token, hash);
}

export function generateAccessToken(userData: UserTokenData): string {
	if (!ACCESS_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRATION) throw new Error("Access token variables not defined");

	const token = sign(userData, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRATION,
		algorithm: "HS256",
	} as SignOptions);

	return token;
}

export function generateRefreshToken(userData: UserTokenData): string {
	if (!REFRESH_TOKEN_SECRET || !REFRESH_TOKEN_EXPIRATION) throw new Error("Refresh token variables not defined");

	const token = sign(userData, REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRATION,
		algorithm: "HS256",
	} as SignOptions);

	return token;
}

export function getDataFromAccessToken(token: string): UserTokenData | undefined {
	if (!ACCESS_TOKEN_SECRET) throw new Error("Access token secret not defined");

	try {
		const verified = verify(token, ACCESS_TOKEN_SECRET) as UserTokenData;
		return verified;
	} catch (error) {
		return undefined;
	}
}

export function getDataFromRefreshToken(token: string): UserTokenData | undefined {
	if (!REFRESH_TOKEN_SECRET) throw new Error("Refresh token secret not defined");

	try {
		const verified = verify(token, REFRESH_TOKEN_SECRET) as UserTokenData;
		return verified;
	} catch (error) {
		return undefined;
	}
}

export function getToken(req: Request): string | undefined {
	const authHeader = req.headers.authorization;
	const token = authHeader?.split(" ")[1];
	return token;
}

export function isAuthenticated(req: AuthRequest) {
	return req.user != undefined;
}

export function isAdministrator(req: AuthRequest) {
	return req.user?.isAdmin;
}
