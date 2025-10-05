import { Router } from "express";

import { requireAdmin, requireAuth } from "../../middlewares/security.middleware";
import { validateData, validateId } from "../../middlewares/data.middleware";
import { sameUserOrAdmin } from "../../modules/user/user.controller";
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
