import { Router } from "express";

import { validateData, validateId } from "#src/middlewares/data.middleware";
import { requireAdmin } from "#src/middlewares/security.middleware";

import TypeController from "./type.controller";
import { createTypeSchema, updateTypeSchema } from "./type.model";

const router = Router();

router.get("/", TypeController.readMany);
router.get("/:id", validateId, TypeController.readOne);

router.post("/", requireAdmin, validateData(createTypeSchema), TypeController.createOne);
router.patch("/:id", requireAdmin, validateId, validateData(updateTypeSchema), TypeController.updateOne);
router.delete("/:id", requireAdmin, validateId, TypeController.deleteOne);

export default router;
