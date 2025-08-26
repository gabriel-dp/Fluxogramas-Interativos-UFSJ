import { generateUniqueCourse } from "@/modules/course/__tests__/course.repository.test";
import CourseService from "@/modules/course/course.service";
import UserService from "@/modules/user/user.service";
import { ADMIN_CREDENTIALS, generateNewUserData, NORMAL_CREDENTIALS, signIn } from "@/utils/tests/tests.credentials";
import { api, authHeaders, expectRequestFail, expectRequestSuccess } from "@/utils/tests/tests.requests";

describe("GET /permission_user_course/user/:id", () => {
	describe("No auth", () => {
		it("should not retrieve courses from all users", async () => {
			await expectRequestFail(401, () => api.get("/permission_user_course/user/1"));
		});
	});

	describe("Normal user", () => {
		it("should not retrieve courses from other users", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.get("/permission_user_course/user/1", authHeaders(token)));
		});

		it("should retrieve courses from itself", async () => {
			const { token, id } = await signIn(NORMAL_CREDENTIALS);
			const response = await expectRequestSuccess(200, () =>
				api.get(`/permission_user_course/user/${id}`, authHeaders(token)),
			);
			expect(Array.isArray(response?.data)).toBe(true);
		});
	});

	describe("Admin", () => {
		it("should retrieve courses from all users", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			const user = await UserService.create(generateNewUserData());
			const response = await expectRequestSuccess(200, () =>
				api.get(`/permission_user_course/user/${user.id}`, authHeaders(token)),
			);
			expect(Array.isArray(response?.data)).toBe(true);
		});

		it("should not retrieve courses from an invalid user", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.get(`/permission_user_course/user/${999999}`, authHeaders(token)));
		});
	});
});

describe("GET /permission_user_course/course/:id", () => {
	describe("No auth", () => {
		it("should not retrieve users from all courses", async () => {
			await expectRequestFail(401, () => api.get("/permission_user_course/course/1"));
		});
	});

	describe("Normal user", () => {
		it("should not retrieve users from all users", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.get("/permission_user_course/course/1", authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should retrieve courses from all users", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			const course = await CourseService.create(await generateUniqueCourse());
			const response = await expectRequestSuccess(200, () =>
				api.get(`/permission_user_course/course/${course.id}`, authHeaders(token)),
			);
			expect(Array.isArray(response?.data)).toBe(true);
		});

		it("should not retrieve courses from an invalid course", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.get(`/permission_user_course/course/${999999}`, authHeaders(token)));
		});
	});
});

describe("PUT /permission_user_course/user/:id", () => {
	describe("No auth", () => {
		it("should not set user permissions", async () => {
			await expectRequestFail(401, () => api.get("/permission_user_course/course/1"));
		});
	});

	describe("Normal user", () => {
		it("should not set user permissions", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.get("/permission_user_course/course/1", authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should set user permissions", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			const user = await UserService.create(generateNewUserData());
			const course = await CourseService.create(await generateUniqueCourse());
			const response = await expectRequestSuccess(201, () =>
				api.put(`/permission_user_course/user/${user.id}`, { courseIds: [course.id] }, authHeaders(token)),
			);
			expect(response?.data).toHaveProperty("userId", user.id);
			expect(response?.data).toHaveProperty("courseIds");
			expect(response?.data.courseIds.length).toBe(1);
			expect(response?.data.courseIds[0]).toBe(course.id);
		});

		it("should not set permissions of an invalid user", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () =>
				api.put(`/permission_user_course/user/${99999}`, { courseIds: [99999] }, authHeaders(token)),
			);
		});

		it("should not set user permissions with an invalid course", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			const user = await UserService.create(generateNewUserData());
			await expectRequestFail(404, () =>
				api.put(`/permission_user_course/user/${user.id}`, { courseIds: [99999] }, authHeaders(token)),
			);
		});
	});
});
