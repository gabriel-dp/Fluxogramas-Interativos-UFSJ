import { Router } from "express";

import { validateData, validateId } from "@/middlewares/data.middleware";
import { requireAdmin, requireAuth } from "@/middlewares/security.middleware";

import { createCourseSchema, updateCourseSchema } from "./course.model";

import CourseController from "./course.controller";

const router = Router();

router.get("/", CourseController.readMany);
router.get("/:id", validateId, CourseController.readOne);

router.post("/", requireAdmin, validateData(createCourseSchema), CourseController.createOne);
router.patch("/:id", requireAuth, validateId, validateData(updateCourseSchema), CourseController.updateOne);
router.delete("/:id", requireAdmin, validateId, CourseController.deleteOne);

export default router;
