import { Request, Response } from "express";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

import prisma from "@/lib/prisma";
import { AuthRequest, UserTokenData } from "@/middlewares/security.middleware";
import { userRegistrationSchema, userSignInSchema } from "@/models/user.model";

const secret = process.env.JWT_SECRET;

async function register(req: AuthRequest, res: Response) {
	const user = req.user;
	const { login, password, ...data } = userRegistrationSchema.parse(req.body);

	if (!user?.isAdmin && data.isAdmin) return res.sendStatus(403); // Only admins can create other admins

	try {
		const existingUser = await prisma.user.findUnique({ where: { login } });
		if (existingUser) return res.sendStatus(400);

		const passwordHash = await hash(password, 10);
		await prisma.user.create({
			data: {
				login: login,
				password: passwordHash,
				isAdmin: data.isAdmin,
			},
		});

		return res.sendStatus(201);
	} catch (error) {
		return res.sendStatus(500);
	}
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
		const token = sign(data, secret, { expiresIn: "1h" });
		res.json({ token });
	} catch (error) {
		return res.sendStatus(500);
	}
}

const AuthController = {
	register,
	signIn,
};

export default AuthController;
