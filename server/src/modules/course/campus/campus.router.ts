import { Router } from "express";

import { validateData, validateId } from "@/middlewares/data.middleware";
import { requireAdmin } from "@/middlewares/security.middleware";

import CourseController from "./campus.controller";
import { createCampusSchema, updateCampusSchema } from "./campus.model";

const router = Router();

router.get("/", CourseController.readMany);
router.get("/:id", validateId, CourseController.readOne);

router.post("/", requireAdmin, validateData(createCampusSchema), CourseController.createOne);
router.patch("/:id", requireAdmin, validateId, validateData(updateCampusSchema), CourseController.updateOne);
router.delete("/:id", requireAdmin, validateId, CourseController.deleteOne);

export default router;
