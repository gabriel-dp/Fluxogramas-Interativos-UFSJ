import { Router } from "express";

import UserController from "@/controllers/user.controller";
import { getAuth, requireAdmin } from "@/middlewares/security.middleware";
import { validateData, validateId } from "@/middlewares/data.middleware";
import { userRegistrationSchema } from "@/models/user.model";

const router = Router();

router.get("/", requireAdmin, UserController.readMany);
router.post("/", requireAdmin, validateData(userRegistrationSchema), UserController.createOne);

router.get("/:id", getAuth, validateId, UserController.readOne);
router.put("/:id", getAuth, validateId, validateData(userRegistrationSchema), UserController.updateOne);
router.delete("/:id", requireAdmin, validateId, UserController.deleteOne);

export default router;
