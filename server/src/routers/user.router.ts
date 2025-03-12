import { Router } from "express";

import UserController from "@/controllers/user.controller";
import { getAuth, requireAdmin } from "@/middlewares/security.middleware";
import { validateData, validateId } from "@/middlewares/data.middleware";
import { userRegistrationSchema, userUpdateSchema } from "@/models/user.model";

const router = Router();

router.get("/", requireAdmin, UserController.readMany);
router.post("/", requireAdmin, validateData(userRegistrationSchema), UserController.createOne);

router.get("/:id", getAuth, validateId, UserController.readOne);
router.patch("/:id", getAuth, validateId, validateData(userUpdateSchema), UserController.updateOne);
router.delete("/:id", requireAdmin, validateId, UserController.deleteOne);

export default router;
