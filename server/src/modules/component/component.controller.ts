import { Request, Response } from "express";

import { getId } from "@/utils/request.utils";
import { AuthRequest } from "@/utils/auth.utils";
import { AuthException, handleError } from "@/utils/exception.utils";
import PermissionUserCouseService from "@/modules/permission_user_course/permission_user_course.service";

import ComponentService from "./component.service";
import { CreateComponentData, UpdateComponentData, SetComponentsData } from "./component.model";

async function readMany(req: Request, res: Response) {
	try {
		const components = await ComponentService.getAll();
		return res.status(200).json(components);
	} catch (error) {
		return handleError(res, error);
	}
}

async function readOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		const component = await ComponentService.getOne(id);
		return res.status(200).json(component);
	} catch (error) {
		return handleError(res, error);
	}
}

async function createOne(req: Request, res: Response) {
	const data = req.body as CreateComponentData;

	try {
		const component = await ComponentService.create(data);
		return res.status(201).json(component);
	} catch (error) {
		return handleError(res, error);
	}
}

async function updateOne(req: Request, res: Response) {
	const id = getId(req);
	const data = req.body as UpdateComponentData;

	try {
		const component = await ComponentService.update(id, data);
		return res.status(200).json(component);
	} catch (error) {
		return handleError(res, error);
	}
}

async function deleteOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		await ComponentService.delete(id);
		return res.sendStatus(204);
	} catch (error) {
		return handleError(res, error);
	}
}

async function getAllFromCourse(req: Request, res: Response) {
	const id = getId(req);

	try {
		const components = await ComponentService.getAllFromCourse(id);
		return res.status(200).json(components);
	} catch (error) {
		return handleError(res, error);
	}
}

async function setAllComponents(req: AuthRequest, res: Response) {
	const id = getId(req);
	const data = req.body as SetComponentsData;

	try {
		if (req.user?.id) {
			const isAuthorized = await PermissionUserCouseService.isUserAllowed(req.user.id, id);
			if (!isAuthorized) throw new AuthException(req, "User Course not allowed");
		}

		const components = await ComponentService.setAllComponents(id, data);
		return res.status(201).json(components);
	} catch (error) {
		return handleError(res, error);
	}
}

export default {
	readMany,
	readOne,
	createOne,
	updateOne,
	deleteOne,
	getAllFromCourse,
	setAllComponents,
};
