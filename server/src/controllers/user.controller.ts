import { Request, Response } from "express";

import prisma from "@/lib/prisma";

async function readAll(_: Request, res: Response) {
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

		if (!user) res.sendStatus(404);

		res.status(200).json({ user });
	} catch (error) {
		res.sendStatus(500);
	}
}

const UserController = {
	readAll,
	readOne,
};

export default UserController;
