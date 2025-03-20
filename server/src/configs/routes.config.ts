import { Router } from "express";

import authRouter from "@/modules/auth/auth.router";
import courseRouter from "@/modules/course/course.router";
import defaultRouter from "@/modules/default/default.router";
import userRouter from "@/modules/user/user.router";

const router = Router();

router.use("/", defaultRouter);
router.use("/auth", authRouter);
router.use("/course", courseRouter);
router.use("/user", userRouter);

export default router;
