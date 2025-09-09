import UserService from "#src/modules/user/user.service";
import CourseService from "#src/modules/course/course.service";
import { generateNewUserData } from "#src/utils/tests/tests.credentials";
import { generateUniqueCourse } from "#src/modules/course/__tests__/course.repository.test";

import PermissionUserCourseService from "../permission_user_course.service";

describe("PermissionUserCourseService", () => {
	it("should create users with no permissions", async () => {
		const user = await UserService.create(generateNewUserData());
		const courses = await PermissionUserCourseService.getCoursesByUser(user.id);

		expect(courses.length).toBe(0);
	});

	it("should set multiple courses permissions to a user", async () => {
		const user = await UserService.create(generateNewUserData());
		const coursesData = await Promise.all(Array.from({ length: 10 }).map(() => generateUniqueCourse()));
		const courses = await Promise.all(coursesData.map((course) => CourseService.create(course)));

		const permissions = await PermissionUserCourseService.setUserPermissions({
			userId: user.id,
			courseIds: courses.map((course) => course.id),
		});

		await Promise.all(
			courses.map(async (course) => {
				const users = await PermissionUserCourseService.getUsersByCourse(course.id);
				expect(users.length).toBe(1);
				expect(users[0].id).toBe(user.id);
			}),
		);

		expect(permissions.userId).toBe(user.id);
		expect(permissions.courseIds.length).toBe(courses.length);
		courses.forEach(async (course) => {
			expect(permissions.courseIds.filter((courseId) => courseId == course.id).length).toBe(1);
		});
	});

	it("should redefine courses permissions of a user", async () => {
		const user = await UserService.create(generateNewUserData());
		const coursesDataOld = await Promise.all(Array.from({ length: 10 }).map(() => generateUniqueCourse()));
		const coursesOld = await Promise.all(coursesDataOld.map((course) => CourseService.create(course)));

		const permissionsOld = await PermissionUserCourseService.setUserPermissions({
			userId: user.id,
			courseIds: coursesOld.map((course) => course.id),
		});

		expect(permissionsOld.userId).toBe(user.id);
		expect(permissionsOld.courseIds.length).toBe(coursesOld.length);
		coursesOld.forEach(async (course) => {
			expect(permissionsOld.courseIds.filter((courseId) => courseId == course.id).length).toBe(1);
		});

		const coursesDataNew = await Promise.all(Array.from({ length: 5 }).map(() => generateUniqueCourse()));
		const coursesNew = await Promise.all(coursesDataNew.map((course) => CourseService.create(course)));

		const permissionsNew = await PermissionUserCourseService.setUserPermissions({
			userId: user.id,
			courseIds: coursesNew.map((course) => course.id),
		});

		expect(permissionsNew.userId).toBe(user.id);
		expect(permissionsNew.courseIds.length).toBe(coursesDataNew.length);
		coursesNew.forEach(async (course) => {
			expect(permissionsNew.courseIds.filter((courseId) => courseId == course.id).length).toBe(1);
		});
	});

	it("should not set permissions of an invalid user (99999)", async () => {
		await expect(
			PermissionUserCourseService.setUserPermissions({
				userId: 99999,
				courseIds: [],
			}),
		).rejects.toThrow();
	});

	it("should not set permissions to an invalid course (99999)", async () => {
		const user = await UserService.create(generateNewUserData());
		await expect(
			PermissionUserCourseService.setUserPermissions({
				userId: user.id,
				courseIds: [99999],
			}),
		).rejects.toThrow();
	});
});
