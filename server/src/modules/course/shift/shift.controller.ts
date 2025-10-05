import { Request, Response } from "express";

import { getId } from "../../..//utils/request.utils";
import { handleError } from "../../..//utils/exception.utils";
import ShiftService from "./shift.service";
import { CreateShiftData, UpdateShiftData } from "./shift.model";

async function readMany(req: Request, res: Response) {
	try {
		const courses = await ShiftService.getAll();
		return res.status(200).json(courses);
	} catch (error) {
		return handleError(res, error);
	}
}

async function readOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		const course = await ShiftService.getOne(id);
		return res.status(200).json(course);
	} catch (error) {
		return handleError(res, error);
	}
}

async function createOne(req: Request, res: Response) {
	const data = req.body as CreateShiftData;

	try {
		const course = await ShiftService.create(data);
		return res.status(201).json(course);
	} catch (error) {
		return handleError(res, error);
	}
}

async function updateOne(req: Request, res: Response) {
	const id = getId(req);
	const data = req.body as UpdateShiftData;

	try {
		const course = await ShiftService.update(id, data);
		return res.status(200).json(course);
	} catch (error) {
		return handleError(res, error);
	}
}

async function deleteOne(req: Request, res: Response) {
	const id = getId(req);

	try {
		await ShiftService.delete(id);
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
