import { Router } from "express";

import defaultRouter from "@/modules/default/default.router";
import userRouter from "@/modules/user/user.router";
import authRouter from "@/modules/auth/auth.router";
import typeRouter from "@/modules/course/type/type.router";
import shiftRouter from "@/modules/course/shift/shift.router";
import campusRouter from "@/modules/course/campus/campus.router";
import courseRouter from "@/modules/course/course.router";

const router = Router();

/*
 *  Routes should not be numeric only
 *  Child routes should be defined before parent routes
 *  Avoid PUT routes to update, PATCH is preferred
 */

router.use("/", defaultRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/course/type", typeRouter);
router.use("/course/shift", shiftRouter);
router.use("/course/campus", campusRouter);
router.use("/course", courseRouter);

export default router;
