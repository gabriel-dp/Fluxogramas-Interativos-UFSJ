import { Router } from "express";

import { validateData, validateId } from "@/middlewares/data.middleware";
import { requireAdmin, requireAuth } from "@/middlewares/security.middleware";

import ShiftController from "./shift.controller";
import { createShiftSchema, updateShiftSchema } from "./shift.model";

const router = Router();

router.get("/", ShiftController.readMany);
router.get("/:id", validateId, ShiftController.readOne);

router.post("/", requireAdmin, validateData(createShiftSchema), ShiftController.createOne);
router.patch("/:id", requireAuth, validateId, validateData(updateShiftSchema), ShiftController.updateOne);
router.delete("/:id", requireAdmin, validateId, ShiftController.deleteOne);

export default router;
