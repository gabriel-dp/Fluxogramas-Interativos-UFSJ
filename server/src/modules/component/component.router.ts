import { Router } from "express";

import { validateData, validateId } from "../../middlewares/data.middleware";
import { requireAuth } from "../../middlewares/security.middleware";
import ComponentController from "./component.controller";
import { createComponentSchema, setRequisitesSchema, updateComponentSchema } from "./component.model";

const router = Router();

router.get("/", ComponentController.readMany);
router.get("/course/:id", validateId, ComponentController.getAllFromCourse);
router.get("/:id", validateId, ComponentController.readOne);

router.post("/", requireAuth, validateData(createComponentSchema), ComponentController.createOne);
router.put(
	"/requisites/:id",
	requireAuth,
	validateId,
	validateData(setRequisitesSchema),
	ComponentController.setRequisites,
);
router.patch("/:id", requireAuth, validateId, validateData(updateComponentSchema), ComponentController.updateOne);
router.delete("/:id", requireAuth, validateId, ComponentController.deleteOne);

export default router;
