import { z } from "zod";

export const permissionUserCourseSchema = z.object({
	userId: z.number().int().positive(),
	courseIds: z.array(z.number().int().positive()),
});

export const createPermissionUserCourseSchema = permissionUserCourseSchema.omit({ userId: true });
export type CreatePermissionUserCourseData = z.TypeOf<typeof createPermissionUserCourseSchema>;

export interface IPermissionsUserCourse {
	userId: number;
	courseIds: number[];
}

export interface ISinglePermissionUserCourse {
	userId: number;
	courseId: number;
}

export function convertToSinglePermissions(permissions: IPermissionsUserCourse): ISinglePermissionUserCourse[] {
	return permissions.courseIds.map((courseId) => ({ userId: permissions.userId, courseId }));
}

export function convertToPermissionsObject(
	userId: number,
	permissions: ISinglePermissionUserCourse[]
): IPermissionsUserCourse {
	return { userId, courseIds: permissions.map((permission) => permission.courseId) };
}
