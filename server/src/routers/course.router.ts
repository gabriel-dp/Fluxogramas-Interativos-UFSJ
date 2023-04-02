import { Router } from "express";

import courseController from "../controllers/course.controller";

const router = Router();

router.get("/", courseController.getAllCourses);
router.get("/get/:id", courseController.getCourse);
router.post("/create", courseController.createCourse);
router.delete("/delete/:id", courseController.deleteCourse);

export default router;
