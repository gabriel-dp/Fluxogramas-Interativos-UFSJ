import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { timingSafeEqual } from "crypto";

import Course from "@/models/course";

function requireAdmin(req: Request, res: Response, next: NextFunction) {
	const adminApiKey = process.env.ADMIN_TOKEN;
	const authHeaderArray = req.headers.authorization?.split(" ");

	if (!adminApiKey) {
		return res.sendStatus(500);
	}

	if (!authHeaderArray || authHeaderArray.length != 2 || authHeaderArray[0] != "Bearer") {
		return res.sendStatus(401);
	}

	const token = authHeaderArray[1];
	if (timingSafeEqual(Buffer.from(token), Buffer.from(adminApiKey))) {
		return res.sendStatus(403);
	}

	next();
}

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
	requireAdmin(req, res, async () => {
		const newCourse = req.body;

		try {
			const oldCourse = await Course.findOne({ code: newCourse?.code }).lean().exec();

			if (oldCourse) {
				res.status(409).send(`A course with the code '${newCourse?.code}' already exists`);
			} else {
				await Course.create(newCourse);
				res.status(201).send(newCourse);
			}
		} catch (error) {
			res.status(500).send(error);
		}
	});
}

async function deleteCourse(req: Request, res: Response) {
	requireAdmin(req, res, async () => {
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
	});
}

async function updateCourse(req: Request, res: Response) {
	requireAdmin(req, res, async () => {
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
	});
}

export default { getAllCourses, getCourse, createCourse, deleteCourse, updateCourse };
