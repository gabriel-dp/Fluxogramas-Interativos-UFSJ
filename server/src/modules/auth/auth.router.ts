import { Router } from "express";

import { validateData } from "#src/middlewares/data.middleware";
import { createUserSchema } from "#src/modules/user/user.model";

import AuthController from "./auth.controller";
import { signInSchema } from "./auth.model";

const router = Router();

router.post("/register", validateData(createUserSchema), AuthController.register);
router.post("/sign-in", validateData(signInSchema), AuthController.signIn);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

export default router;
