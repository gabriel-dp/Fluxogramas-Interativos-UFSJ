import { Request, Response } from "express";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

import prisma from "@/lib/prisma";
import { UserTokenData } from "@/utils/auth.utils";
import { userSignInSchema } from "@/models/user.model";

import UserController from "./user.controller";

const secret = process.env.JWT_SECRET;
const EXPIRATION_TIME = "1h";

async function register(req: Request, res: Response) {
	UserController.createOne(req, res);
}

async function signIn(req: Request, res: Response) {
	const { login, password } = userSignInSchema.parse(req.body);

	try {
		const user = await prisma.user.findUnique({ where: { login } });
		if (!user) return res.sendStatus(400);

		const match = await compare(password, user.password);
		if (!match) return res.sendStatus(400);

		if (!secret) return res.sendStatus(500);

		const data: UserTokenData = { id: user.id, isAdmin: user.isAdmin };
		const token = sign(data, secret, { expiresIn: EXPIRATION_TIME });
		res.json({ token });
	} catch (error) {
		return res.sendStatus(500);
	}
}

async function registerFirstAdminIfNotExists() {
	const administratorExists = await prisma.user.findFirst({ where: { isAdmin: true } });
	if (administratorExists) return;

	const ADMIN = {
		login: "administrator",
		password: "@admin123",
	};

	const passwordHash = await hash(ADMIN.password, 10);
	await prisma.user.create({
		data: {
			login: ADMIN.login,
			password: passwordHash,
			isAdmin: true,
		},
	});
}

registerFirstAdminIfNotExists();

const AuthController = {
	register,
	signIn,
};

export default AuthController;
