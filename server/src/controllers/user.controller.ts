import { Request, Response } from "express";
import { hash } from "bcryptjs";

import prisma from "@/lib/prisma";
import { getId } from "@/utils/request.utils";
import { AuthRequest, isAdministrator, isAuthenticated } from "@/utils/auth.utils";

async function readMany(req: Request, res: Response) {
	try {
		const allUsers = await prisma.user.findMany({
			omit: { password: true },
		});
		res.status(200).send(allUsers);
	} catch (error) {
		res.sendStatus(500);
	}
}

async function readOne(req: AuthRequest, res: Response) {
	const id = getId(req);

	// Only admins can manage other users
	if (req.user?.id != id) {
		if (!isAuthenticated(req)) return res.sendStatus(401);
		if (!isAdministrator(req)) return res.sendStatus(403);
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id },
			omit: { password: true },
		});

		if (!user) return res.sendStatus(404);

		return res.status(200).json(user);
	} catch (error) {
		return res.sendStatus(500);
	}
}

async function createOne(req: AuthRequest, res: Response) {
	const { login, password, ...data } = req.body;

	// Only admins can create other admins
	if (data.isAdmin) {
		if (!isAuthenticated(req)) return res.sendStatus(401);
		if (!isAdministrator(req)) return res.sendStatus(403);
	}

	try {
		const existingUser = await prisma.user.findUnique({ where: { login } });
		if (existingUser) return res.sendStatus(400);

		const passwordHash = await hash(password, 10);
		const user = await prisma.user.create({
			data: {
				login,
				password: passwordHash,
				isAdmin: data.isAdmin,
			},
		});

		return res.status(201).json({ ...user, password: undefined });
	} catch (error) {
		return res.sendStatus(500);
	}
}

async function updateOne(req: AuthRequest, res: Response) {
	const id = getId(req);
	const { login, password, ...data } = req.body;

	// Only admins can manage other users
	if (req.user?.id != id) {
		if (!isAuthenticated(req)) return res.sendStatus(401);
		if (!isAdministrator(req)) return res.sendStatus(403);
	}
	// Only admins can create other admins
	if (data.isAdmin) {
		if (!isAuthenticated(req)) return res.sendStatus(401);
		if (!isAdministrator(req)) return res.sendStatus(403);
	}

	try {
		if (login) {
			const existingUser = await prisma.user.findFirst({
				where: {
					login,
					NOT: { id },
				},
			});
			if (existingUser) return res.sendStatus(400);
		}

		const passwordHash = password ? await hash(password, 10) : undefined;
		const user = await prisma.user.update({
			data: {
				login,
				password: passwordHash,
				...data,
			},
			where: { id },
		});

		return res.status(200).json({ ...user, password: undefined });
	} catch (error) {
		return res.sendStatus(500);
	}
}

async function deleteOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		await prisma.user.delete({ where: { id } });

		const existingUser = await prisma.user.findUnique({ where: { id } });
		if (!existingUser) return res.sendStatus(404);

		return res.sendStatus(200);
	} catch (error) {
		return res.sendStatus(500);
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
