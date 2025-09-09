import prisma from "#src/lib/prisma";
import {
	convertToPermissionsObject,
	convertToSinglePermissions,
	IPermissionsUserCourse,
	ISinglePermissionUserCourse,
} from "./permission_user_course.model";

import { ICourse } from "#src/modules/course/course.model";
import { IUser } from "#src/modules/user/user.model";

const PermissionUserCourseRepository = {
	async getCoursesByUser(userId: number): Promise<ICourse[]> {
		const permissions = await prisma.userCoursePermission.findMany({
			where: { userId },
			include: { course: true },
			orderBy: {
				course: {
					code: "asc",
				},
			},
		});
		return permissions.map((p) => p.course);
	},

	async getUsersByCourse(courseId: number): Promise<IUser[]> {
		const permissions = await prisma.userCoursePermission.findMany({
			where: { courseId },
			include: { user: true },
			orderBy: {
				user: {
					username: "asc",
				},
			},
		});
		return permissions.map((p) => p.user);
	},

	async setUserPermissions(permissions: IPermissionsUserCourse): Promise<IPermissionsUserCourse> {
		await prisma.userCoursePermission.deleteMany({
			where: { userId: permissions.userId },
		});

		const permissionsArray: ISinglePermissionUserCourse[] = convertToSinglePermissions(permissions);
		const newPermissions: ISinglePermissionUserCourse[] = await prisma.userCoursePermission.createManyAndReturn({
			data: permissionsArray,
		});

		return convertToPermissionsObject(permissions.userId, newPermissions);
	},

	async removeCoursePermissions(courseId: number): Promise<void> {
		await prisma.userCoursePermission.deleteMany({
			where: { courseId },
		});
	},
};

export default PermissionUserCourseRepository;
