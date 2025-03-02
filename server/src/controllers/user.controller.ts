import { Request, Response } from "express";
import { hash } from "bcryptjs";

import prisma from "@/lib/prisma";
import { AuthRequest, requireAdmin } from "@/middlewares/security.middleware";

async function readMany(_: Request, res: Response) {
	try {
		const allUsers = await prisma.user.findMany({
			omit: { password: true },
		});
		return res.status(200).send(allUsers);
	} catch (e) {
		console.log(e);
	}
}

async function readOne(req: Request, res: Response) {
	const id = parseInt(req.params.id, 10);

	try {
		const user = await prisma.user.findUnique({
			where: { id },
			omit: { password: true },
		});

		if (!user) return res.sendStatus(404);

		res.status(200).json({ user });
	} catch (error) {
		res.sendStatus(500);
	}
}

async function createOne(req: AuthRequest, res: Response) {
	const { login, password, ...data } = req.body;

	if (data.isAdmin) requireAdmin(req, res, () => undefined); // Only admins can create other admins

	try {
		const existingUser = await prisma.user.findUnique({ where: { login } });
		if (existingUser) return res.sendStatus(400);

		const passwordHash = await hash(password, 10);
		await prisma.user.create({
			data: {
				login,
				password: passwordHash,
				isAdmin: data.isAdmin,
			},
		});

		return res.sendStatus(201);
	} catch (error) {
		return res.sendStatus(500);
	}
}

async function updateOne(req: AuthRequest, res: Response) {
	const id = parseInt(req.params.id, 10);
	const { login, password, ...data } = req.body;

	if (req.user?.id != id) requireAdmin(req, res, () => undefined); // Only admins can modify data from other users
	if (data.isAdmin) requireAdmin(req, res, () => undefined); // Only admins can create other admins

	try {
		const existingUser = await prisma.user.findFirst({
			where: {
				login,
				NOT: { id },
			},
		});
		if (existingUser) return res.sendStatus(400);

		const passwordHash = await hash(password, 10);
		await prisma.user.update({
			data: {
				login,
				password: passwordHash,
				...data,
			},
			where: { id },
		});

		res.sendStatus(200);
	} catch (error) {
		res.sendStatus(500);
	}
}

async function deleteOne(req: Request, res: Response) {
	const id = parseInt(req.params.id, 10);

	try {
		await prisma.user.delete({ where: { id } });

		const existingUser = await prisma.user.findUnique({ where: { id } });
		if (!existingUser) return res.sendStatus(404);

		res.sendStatus(200);
	} catch (error) {
		res.sendStatus(500);
	}
}

const UserController = {
	readMany,
	readOne,
	createOne,
	updateOne,
	deleteOne,
};

export default UserController;
