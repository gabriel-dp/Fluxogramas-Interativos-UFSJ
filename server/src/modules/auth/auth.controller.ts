import { Request, Response } from "express";
import ms from "ms";

import { handleError } from "#src/utils/exception.utils";
import { generateAccessToken, getDataFromRefreshToken } from "#src/utils/auth.utils";

import AuthService from "./auth.service";
import { RegisterData, SignInSchema } from "./auth.model";
import UserService from "../user/user.service";

async function register(req: Request, res: Response) {
	const data = req.body as RegisterData;

	try {
		const user = await AuthService.register(data);
		return res.status(201).json({ ...user, password: undefined });
	} catch (error) {
		return handleError(res, error);
	}
}

async function signIn(req: Request, res: Response) {
	const data = req.body as SignInSchema;

	try {
		const { user, accessToken, refreshToken } = await AuthService.signIn(data);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: ms((process.env.REFRESH_TOKEN_EXPIRATION as ms.StringValue) ?? "7d"),
		});

		return res.status(200).json({ user: { ...user, password: undefined }, token: accessToken });
	} catch (error) {
		return handleError(res, error);
	}
}

async function refreshToken(req: Request, res: Response) {
	const { refreshToken } = req.cookies as { refreshToken: string };

	try {
		const refreshTokenData = getDataFromRefreshToken(refreshToken);
		if (refreshTokenData && (await AuthService.validateRefreshToken(refreshTokenData.id, refreshToken))) {
			const accessToken = generateAccessToken({ id: refreshTokenData.id, isAdmin: refreshTokenData.isAdmin });
			const user = await UserService.getOne(refreshTokenData.id);

			return res.status(200).json({ user: { ...user, password: undefined }, token: accessToken });
		}
		return res.sendStatus(403);
	} catch (error) {
		return handleError(res, error);
	}
}

async function logout(req: Request, res: Response) {
	const { refreshToken } = req.cookies as { refreshToken: string };

	if (!refreshToken) {
		return res.sendStatus(204);
	}

	try {
		const tokenData = getDataFromRefreshToken(refreshToken);
		if (tokenData && (await AuthService.validateRefreshToken(tokenData.id, refreshToken))) {
			await AuthService.logout(tokenData.id);
		}
	} catch (error) {
		return handleError(res, error);
	} finally {
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
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
