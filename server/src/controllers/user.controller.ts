import { Request, Response } from "express";
import { hash } from "bcryptjs";

import prisma from "@/lib/prisma";
import { getId } from "@/utils/request.utils";
import { AuthRequest, isAdministrator } from "@/utils/auth.utils";

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

async function readOne(req: AuthRequest, res: Response) {
	const id = getId(req);

	if (req.user?.id != id && !isAdministrator(req)) return res.sendStatus(403); // Only admins can manage other users

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

	if (data.isAdmin && !isAdministrator(req)) return res.sendStatus(403); // Only admins can create other admins

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
		console.log(error);
		return res.sendStatus(500);
	}
}

async function updateOne(req: AuthRequest, res: Response) {
	const id = getId(req);
	const { login, password, ...data } = req.body;

	if (req.user?.id != id && !isAdministrator(req)) return res.sendStatus(403); // Only admins can manage other users
	if (data.isAdmin && isAdministrator(req)) return res.sendStatus(403); // Only admins can create other admins

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
	const id = getId(req);

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
