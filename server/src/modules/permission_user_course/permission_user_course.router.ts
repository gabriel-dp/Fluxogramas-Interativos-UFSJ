import { Router } from "express";

import { requireAdmin } from "@/middlewares/security.middleware";

import PermissionUserCourseController from "./permission_user_course.controller";
import { validateData, validateId } from "@/middlewares/data.middleware";
import { createPermissionUserCourseSchema } from "./permission_user_course.model";

const router = Router();

router.get("/user/:id", requireAdmin, validateId, PermissionUserCourseController.getCoursesByUser);
router.get("/course/:id", requireAdmin, validateId, PermissionUserCourseController.getUsersByCourse);

router.put(
	"/user/:id",
	requireAdmin,
	validateId,
	validateData(createPermissionUserCourseSchema),
	PermissionUserCourseController.setUserPermissions
);

export default router;
