import UserService from "@/modules/user/user.service";
import CourseService from "@/modules/course/course.service";
import { IUser } from "@/modules/user/user.model";
import { ICourse } from "@/modules/course/course.model";

import { IPermissionsUserCourse } from "./permission_user_course.model";
import PermissionUserCourseRepository from "./permission_user_course.repository";

const PermissionUserCouseService = {
	async getCoursesByUser(userId: number): Promise<ICourse[]> {
		await UserService.getOne(userId);
		return PermissionUserCourseRepository.getCoursesByUser(userId);
	},

	async getUsersByCourse(courseId: number): Promise<IUser[]> {
		await CourseService.getOne(courseId);
		return PermissionUserCourseRepository.getUsersByCourse(courseId);
	},

	async setUserPermissions(permissions: IPermissionsUserCourse) {
		await UserService.getOne(permissions.userId);
		await Promise.all(permissions.courseIds.map((courseId) => CourseService.getOne(courseId)));
		return PermissionUserCourseRepository.setUserPermissions(permissions);
	},
};

export default PermissionUserCouseService;
