import { Router } from "express";

import AuthController from "@/controllers/auth.controller";
import { getAuth } from "@/middlewares/security.middleware";

const router = Router();

router.post("/sign-in", AuthController.signIn);
router.post("/register", getAuth, AuthController.register);

export default router;
