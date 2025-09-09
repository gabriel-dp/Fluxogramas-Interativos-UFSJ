import { Router } from "express";

import { validateData, validateId } from "#src/middlewares/data.middleware";
import { requireAdmin } from "#src/middlewares/security.middleware";

import CourseController from "./course.controller";
import { createCourseSchema, updateCourseSchema } from "./course.model";

const router = Router();

router.get("/", CourseController.readMany);
router.get("/:id", validateId, CourseController.readOne);

router.post("/", requireAdmin, validateData(createCourseSchema), CourseController.createOne);
router.patch("/:id", requireAdmin, validateId, validateData(updateCourseSchema), CourseController.updateOne);
router.delete("/:id", requireAdmin, validateId, CourseController.deleteOne);

export default router;
