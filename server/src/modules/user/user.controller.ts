import { NextFunction, Request, Response } from "express";

import { getId } from "@/utils/request.utils";
import { AuthRequest, isAdministrator } from "@/utils/auth.utils";
import { AuthException, handleError } from "@/utils/exception.utils";

import UserService from "./user.service";
import { CreateUserData, UpdateUserData } from "./user.model";

async function readMany(req: Request, res: Response) {
	try {
		const allUsers = await UserService.getAll();
		res.status(200).send(allUsers);
	} catch (error) {
		return handleError(res, error);
	}
}

async function readOne(req: AuthRequest, res: Response) {
	const id = getId(req);

	try {
		const user = await UserService.getOne(id);
		return res.status(200).json(user);
	} catch (error) {
		return handleError(res, error);
	}
}

async function createOne(req: AuthRequest, res: Response) {
	const data = req.body as CreateUserData;

	try {
		const user = await UserService.create(data);
		return res.status(201).json({ ...user, password: undefined });
	} catch (error) {
		return handleError(res, error);
	}
}

async function updateOne(req: AuthRequest, res: Response) {
	const id = getId(req);
	const data = req.body as UpdateUserData;

	try {
		const user = await UserService.update(id, data);
		return res.status(200).json({ ...user, password: undefined });
	} catch (error) {
		return handleError(res, error);
	}
}

async function deleteOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		await UserService.delete(id);
		return res.sendStatus(204);
	} catch (error) {
		return handleError(res, error);
	}
}

export function sameUserOrAdmin(req: AuthRequest, res: Response, next: NextFunction) {
	const id = getId(req);

	try {
		if (req.user?.id != id) {
			if (!isAdministrator(req)) throw new AuthException(req, "User admin view");
		}
	} catch (error) {
		return handleError(res, error);
	}

	next();
}

export function adminFieldsCheck(req: AuthRequest, res: Response, next: NextFunction) {
	const data = req.body as CreateUserData;

	try {
		// Only admins can create other admins
		if (data.isAdmin == true) {
			if (!isAdministrator(req)) throw new AuthException(req, "User admin view");
		}
	} catch (error) {
		return handleError(res, error);
	}

	next();
}

const UserController = {
	readMany,
	readOne,
	createOne,
	updateOne,
	deleteOne,
};

export default UserController;
