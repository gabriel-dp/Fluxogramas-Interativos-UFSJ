import { Router } from "express";

import defaultRouter from "#src/modules/default/default.router";
import userRouter from "#src/modules/user/user.router";
import authRouter from "#src/modules/auth/auth.router";
import typeRouter from "#src/modules/course/type/type.router";
import shiftRouter from "#src/modules/course/shift/shift.router";
import campusRouter from "#src/modules/course/campus/campus.router";
import courseRouter from "#src/modules/course/course.router";
import permissionsUserCourseRouter from "#src/modules/permission_user_course/permission_user_course.router";
import componentRouter from "#src/modules/component/component.router";

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
router.use("/permission_user_course", permissionsUserCourseRouter);
router.use("/component", componentRouter);

export default router;
