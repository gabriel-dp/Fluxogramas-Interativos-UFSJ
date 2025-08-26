import { Request, Response } from "express";

import { getId } from "@/utils/request.utils";
import { handleError } from "@/utils/exception.utils";

import { CreatePermissionUserCourseData } from "./permission_user_course.model";
import PermissionUserCourseService from "./permission_user_course.service";

async function getCoursesByUser(req: Request, res: Response) {
	const userId = getId(req);

	try {
		const courses = await PermissionUserCourseService.getCoursesByUser(userId);
		return res.status(200).json(courses);
	} catch (error) {
		return handleError(res, error);
	}
}

async function getUsersByCourse(req: Request, res: Response) {
	const courseId = getId(req);

	try {
		const users = await PermissionUserCourseService.getUsersByCourse(courseId);
		return res.status(200).json(users);
	} catch (error) {
		return handleError(res, error);
	}
}

async function setUserPermissions(req: Request, res: Response) {
	const userId = getId(req);
	const data = req.body as CreatePermissionUserCourseData;

	try {
		const users = await PermissionUserCourseService.setUserPermissions({ userId, courseIds: data.courseIds });
		return res.status(201).json(users);
	} catch (error) {
		return handleError(res, error);
	}
}

export default {
	getCoursesByUser,
	getUsersByCourse,
	setUserPermissions,
};
