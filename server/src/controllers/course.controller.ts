import { Router } from "express";

import Course from "../models/course";

const router = Router();

router.get("/", async (_, res) => {
	try {
		const allCourses = await Course.find().select("-curriculum").lean().exec();
		res.status(200).send(allCourses);
	} catch (error) {
		res.status(500).send(error);
	}
});

export default router;
