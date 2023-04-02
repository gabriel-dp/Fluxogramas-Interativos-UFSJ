import { Router } from "express";

import courseController from "../controllers/course.controller";

const router = Router();

router.get("/", courseController.getAllCourses);
router.get("/get/:code", courseController.getCourse);
router.post("/create", courseController.createCourse);
router.delete("/delete/:id", courseController.deleteCourse);
router.patch("/update/:id", courseController.updateCourse);

export default router;
