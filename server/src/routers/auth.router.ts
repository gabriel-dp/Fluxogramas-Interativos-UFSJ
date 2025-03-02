import { Router } from "express";

import AuthController from "@/controllers/auth.controller";
import { getAuth } from "@/middlewares/security.middleware";
import { validateData } from "@/middlewares/data.middleware";
import { userRegistrationSchema, userSignInSchema } from "@/models/user.model";

const router = Router();

router.post("/sign-in", validateData(userSignInSchema), AuthController.signIn);
router.post("/register", validateData(userRegistrationSchema), getAuth, AuthController.register);

export default router;
