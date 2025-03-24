import { Request, Response } from "express";

import { generateToken } from "@/utils/auth.utils";
import { handleError } from "@/utils/exception.utils";

import AuthService from "./auth.service";
import { RegisterData, SignInSchema } from "./auth.model";

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
		const user = await AuthService.signIn(data);
		const token = generateToken({ id: user.id, isAdmin: user.isAdmin });
		return res.status(200).json({ ...user, password: undefined, token });
	} catch (error) {
		return handleError(res, error);
	}
}

const AuthController = {
	register,
	signIn,
};

export default AuthController;
