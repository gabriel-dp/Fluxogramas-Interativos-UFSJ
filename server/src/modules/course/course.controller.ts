import { Request, Response } from "express";

import { getId } from "../../utils/request.utils";
import { handleError } from "../../utils/exception.utils";
import CourseService from "./course.service";
import { CreateCourseData, UpdateCourseData } from "./course.model";

async function readMany(req: Request, res: Response) {
	try {
		const courses = await CourseService.getAll();
		return res.status(200).json(courses);
	} catch (error) {
		return handleError(res, error);
	}
}

async function readOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		const course = await CourseService.getOne(id);
		return res.status(200).json(course);
	} catch (error) {
		return handleError(res, error);
	}
}

async function createOne(req: Request, res: Response) {
	const data = req.body as CreateCourseData;

	try {
		const course = await CourseService.create(data);
		return res.status(201).json(course);
	} catch (error) {
		return handleError(res, error);
	}
}

async function updateOne(req: Request, res: Response) {
	const id = getId(req);
	const data = req.body as UpdateCourseData;

	try {
		const course = await CourseService.update(id, data);
		return res.status(200).json(course);
	} catch (error) {
		return handleError(res, error);
	}
}

async function deleteOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		await CourseService.delete(id);
		return res.sendStatus(204);
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
};
