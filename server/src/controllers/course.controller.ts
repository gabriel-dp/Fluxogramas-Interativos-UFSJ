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
	const { code } = req.params;

	try {
		const course = await Course.findOne({ code: code }).lean().exec();
		res.status(200).send(course);
	} catch (error) {
		res.status(500).send(error);
	}
}

async function createCourse(req: Request, res: Response) {
	const newCourse = req.body;

	try {
		const oldCourse = await Course.findOne({ id: newCourse?.id }).lean().exec();

		if (oldCourse) {
			res.status(409).send(`A course with the id '${newCourse?.id}' already exists`);
		} else {
			await Course.create(newCourse);
			res.status(201).send(newCourse);
		}
	} catch (error) {
		res.status(500).send(error);
	}
}

async function deleteCourse(req: Request, res: Response) {
	const { id } = req.params;

	try {
		const deleted = await Course.findByIdAndRemove({ _id: new Types.ObjectId(id) });
		if (deleted) {
			res.sendStatus(204);
		} else {
			res.status(404).send("Course not found");
		}
	} catch (error) {
		res.status(500).send(error);
	}
}

async function updateCourse(req: Request, res: Response) {
	const { id } = req.params;
	const updates = req.body;

	try {
		const updated = await Course.findByIdAndUpdate(new Types.ObjectId(id), { $set: updates });
		if (updated) {
			res.sendStatus(204);
		} else {
			res.status(404).send("Course not found");
		}
	} catch (error) {
		res.status(500).send(error);
	}
}

export default { getAllCourses, getCourse, createCourse, deleteCourse, updateCourse };
