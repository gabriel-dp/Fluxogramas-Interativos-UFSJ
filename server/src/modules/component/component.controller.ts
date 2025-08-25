import { Request, Response } from "express";

import { getId } from "@/utils/request.utils";
import { AuthRequest } from "@/utils/auth.utils";
import { AuthException, handleError } from "@/utils/exception.utils";
import PermissionUserCourseService from "@/modules/permission_user_course/permission_user_course.service";

import ComponentService from "./component.service";
import { CreateComponentData, UpdateComponentData, SetRequisitesData } from "./component.model";

async function checkUserCoursePermission(req: AuthRequest, courseId: number) {
	const userId = req.user?.id;
	if (userId === undefined) throw new AuthException(req, "No auth");

	const isAuthorized = await PermissionUserCourseService.isUserAllowed(userId, courseId);
	if (!isAuthorized) throw new AuthException(req, "User Course not allowed");
}

async function checkUserComponentPermission(req: AuthRequest, componentId: number) {
	const userId = req.user?.id;
	if (userId === undefined) throw new AuthException(req, "No auth");

	const isAuthorized = await ComponentService.isUserAllowed(userId, componentId);
	if (!isAuthorized) throw new AuthException(req, "User Course not allowed");
}

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
		await checkUserCoursePermission(req, data.courseId);

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
		await checkUserComponentPermission(req, id);
		if (data.courseId) await checkUserCoursePermission(req, data.courseId);

		const component = await ComponentService.update(id, data);
		return res.status(200).json(component);
	} catch (error) {
		return handleError(res, error);
	}
}

async function deleteOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		await checkUserComponentPermission(req, id);
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

async function setRequisites(req: Request, res: Response) {
	const id = getId(req);
	const data = req.body as SetRequisitesData;

	try {
		await checkUserComponentPermission(req, id);
		await Promise.all(data.requisites.map((r) => checkUserComponentPermission(req, r.id)));

		const component = await ComponentService.setRequisites(id, data.requisites);
		return res.status(201).json(component);
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
	setRequisites,
};
