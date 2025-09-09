import { Request, Response } from "express";

import { getId } from "#src/utils/request.utils";
import { handleError } from "#src/utils/exception.utils";

import TypeService from "./type.service";
import { CreateTypeData, UpdateTypeData } from "./type.model";

async function readMany(req: Request, res: Response) {
	try {
		const courses = await TypeService.getAll();
		return res.status(200).json(courses);
	} catch (error) {
		return handleError(res, error);
	}
}

async function readOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		const course = await TypeService.getOne(id);
		return res.status(200).json(course);
	} catch (error) {
		return handleError(res, error);
	}
}

async function createOne(req: Request, res: Response) {
	const data = req.body as CreateTypeData;

	try {
		const course = await TypeService.create(data);
		return res.status(201).json(course);
	} catch (error) {
		return handleError(res, error);
	}
}

async function updateOne(req: Request, res: Response) {
	const id = getId(req);
	const data = req.body as UpdateTypeData;

	try {
		const course = await TypeService.update(id, data);
		return res.status(200).json(course);
	} catch (error) {
		return handleError(res, error);
	}
}

async function deleteOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		await TypeService.delete(id);
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
