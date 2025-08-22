import { Router } from "express";

import { validateData, validateId } from "@/middlewares/data.middleware";
import { requireAdmin, requireAuth } from "@/middlewares/security.middleware";

import ComponentController from "./component.controller";
import { createComponentSchema, setComponentsSchema, updateComponentSchema } from "./component.model";

const router = Router();

router.get("/", ComponentController.readMany);
router.get("/course/:id", validateId, ComponentController.getAllFromCourse);
router.get("/:id", validateId, ComponentController.readOne);

router.post("/", requireAdmin, validateData(createComponentSchema), ComponentController.createOne);
router.put(
	"/course/:id",
	requireAuth,
	validateId,
	validateData(setComponentsSchema),
	ComponentController.setAllComponents,
);
router.patch("/:id", requireAdmin, validateId, validateData(updateComponentSchema), ComponentController.updateOne);
router.delete("/:id", requireAdmin, validateId, ComponentController.deleteOne);

export default router;
