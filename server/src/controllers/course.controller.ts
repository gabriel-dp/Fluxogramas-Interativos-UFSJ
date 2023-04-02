import { Request, Response } from "express";
import { Types } from "mongoose";

import Course from "../models/course";

async function getAllCourses(_: Request, res: Response) {
	try {
		const allCourses = await Course.find().select("-curriculum").lean().exec();
		res.status(200).send(allCourses);
	} catch (error) {
		res.status(500).send(error);
	}
}

async function getCourse(req: Request, res: Response) {
	const { id } = req.params;

	try {
		const course = await Course.findOne({ id: id }).lean().exec();
		res.status(200).send(course);
	} catch (error) {
		res.status(500).send(error);
	}
}

async function createCourse(req: Request, res: Response) {
	const data = req.body;

	try {
		await Course.create(data);
		res.status(201).send(`Course created!`);
	} catch (error) {
		res.status(500).send(error);
	}
}

async function deleteCourse(req: Request, res: Response) {
	const { id } = req.params;

	try {
		await Course.findByIdAndRemove({ _id: new Types.ObjectId(id) });
		res.sendStatus(204);
	} catch (error) {
		res.status(500).send(error);
	}
}

export default { getAllCourses, getCourse, createCourse, deleteCourse };
