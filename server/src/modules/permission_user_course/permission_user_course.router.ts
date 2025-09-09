import { Router } from "express";

import { requireAdmin, requireAuth } from "#src/middlewares/security.middleware";
import { validateData, validateId } from "#src/middlewares/data.middleware";
import { sameUserOrAdmin } from "#src/modules/user/user.controller";

import PermissionUserCourseController from "./permission_user_course.controller";
import { createPermissionUserCourseSchema } from "./permission_user_course.model";

const router = Router();

router.get("/user/:id", requireAuth, validateId, sameUserOrAdmin, PermissionUserCourseController.getCoursesByUser);
router.get("/course/:id", requireAdmin, validateId, PermissionUserCourseController.getUsersByCourse);

router.put(
	"/user/:id",
	requireAdmin,
	validateId,
	validateData(createPermissionUserCourseSchema),
	PermissionUserCourseController.setUserPermissions,
);

export default router;
