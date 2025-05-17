import { Request, Response } from "express";
import ms from "ms";

import { handleError } from "@/utils/exception.utils";
import { generateAccessToken, getDataFromRefreshToken } from "@/utils/auth.utils";

import AuthService from "./auth.service";
import { RegisterData, SignInSchema } from "./auth.model";

const COOKIE_REFRESH_PATH = "/auth/refresh";

async function register(req: Request, res: Response) {
	const data: RegisterData = req.body;

	try {
		const user = await AuthService.register(data);
		return res.status(201).json({ ...user, password: undefined });
	} catch (error) {
		return handleError(res, error);
	}
}

async function signIn(req: Request, res: Response) {
	const data: SignInSchema = req.body;

	try {
		const { user, accessToken, refreshToken } = await AuthService.signIn(data);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: COOKIE_REFRESH_PATH,
			maxAge: ms((process.env.REFRESH_TOKEN_EXPIRATION as ms.StringValue) ?? "7d"),
		});

		return res.status(200).json({ ...user, password: undefined, token: accessToken });
	} catch (error) {
		return handleError(res, error);
	}
}

async function refreshToken(req: Request, res: Response) {
	const { refreshToken } = req.cookies;

	try {
		const refreshTokenData = getDataFromRefreshToken(refreshToken);
		if (refreshTokenData && (await AuthService.validateRefreshToken(refreshTokenData.id, refreshToken))) {
			const accessToken = generateAccessToken({ id: refreshTokenData.id, isAdmin: refreshTokenData.isAdmin });
			return res.status(200).json({ token: accessToken });
		}
		return res.sendStatus(403);
	} catch (error) {
		return handleError(res, error);
	}
}

async function logout(req: Request, res: Response) {
	const token = req.cookies.refreshToken;

	if (!token) {
		return res.sendStatus(204);
	}

	try {
		const tokenData = getDataFromRefreshToken(token);
		if (tokenData && (await AuthService.validateRefreshToken(tokenData.id, token))) {
			await AuthService.logout(tokenData.id);
		}
	} catch (error) {
		return handleError(res, error);
	} finally {
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: COOKIE_REFRESH_PATH,
		});
	}

	return res.sendStatus(204);
}

const AuthController = {
	register,
	signIn,
	refreshToken,
	logout,
};

export default AuthController;
