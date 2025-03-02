import { Router } from "express";

import UserController from "@/controllers/user.controller";
import { requireAdmin } from "@/middlewares/security.middleware";

const router = Router();

router.use(requireAdmin);

router.get("/", UserController.readAll);
router.get("/:id", UserController.readOne);

export default router;
