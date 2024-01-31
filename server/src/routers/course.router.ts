import { Router } from "express";

import courseController from "@/controllers/course.controller";

const router = Router();

// Public requests
router.get("/", courseController.getAllCourses);
router.get("/get/:code", courseController.getCourse);

// Require auth
router.post("/create", courseController.createCourse);
router.delete("/delete/:id", courseController.deleteCourse);
router.patch("/update/:id", courseController.updateCourse);

export default router;
