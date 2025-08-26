import { Router } from "express";

import { validateData, validateId } from "@/middlewares/data.middleware";
import { requireAdmin, requireAuth } from "@/middlewares/security.middleware";

import UserController, { adminFieldsCheck, sameUserOrAdmin } from "./user.controller";
import { createUserSchema, updateUserSchema } from "./user.model";

const router = Router();

router.get("/", requireAdmin, UserController.readMany);
router.post("/", requireAdmin, validateData(createUserSchema), adminFieldsCheck, UserController.createOne);

router.get("/:id", requireAuth, validateId, sameUserOrAdmin, UserController.readOne);
router.patch(
	"/:id",
	requireAuth,
	validateId,
	sameUserOrAdmin,
	validateData(updateUserSchema),
	adminFieldsCheck,
	UserController.updateOne
);
router.delete("/:id", requireAdmin, validateId, UserController.deleteOne);

export default router;
