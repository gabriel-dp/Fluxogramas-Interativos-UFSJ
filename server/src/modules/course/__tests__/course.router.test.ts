import { ADMIN_CREDENTIALS, NORMAL_CREDENTIALS, signIn } from "../../../utils/tests/tests.credentials";
import { api, authHeaders, expectRequestFail, expectRequestSuccess } from "../../../utils/tests/tests.requests";
import { generateUniqueCourse } from "./course.repository.test";
import CourseRepository from "../course.repository";

describe("GET /course", () => {
	it("should retrieve data from all avaliable courses", async () => {
		await CourseRepository.create(await generateUniqueCourse());
		const response = await expectRequestSuccess(200, () => api.get("/course"));
		const courses: object[] = response?.data;
		courses.forEach((course: object) => {
			expect(course).not.toHaveProperty("components");
		});
	});
});

describe("GET /course/:id", () => {
	it("should retrieve data from a single course", async () => {
		const course = await CourseRepository.create(await generateUniqueCourse());
		const response = await expectRequestSuccess(200, () => api.get(`/course/${course.id}`));
		expect(response?.data).toHaveProperty("components");
	});

	it("should not retrieve data from an invalid couse (12345678)", async () => {
		await expectRequestFail(404, () => api.get(`/course/${12345678}`));
	});
});

describe("POST /course", () => {
	describe("No auth", () => {
		it("should not create courses", async () => {
			await expectRequestFail(401, () => api.post("/course", {}));
		});
	});

	describe("Normal user", () => {
		it("should not create courses", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.post("/course", {}, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should create a course providing its data", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			const courseData = await generateUniqueCourse();
			const response = await expectRequestSuccess(201, () => api.post("/course", courseData, authHeaders(token)));

			expect(response?.data).toHaveProperty("id");
			expect(response?.data.code).toBe(courseData.code);
			expect(response?.data.name).toBe(courseData.name);
			expect(response?.data.type.id).toBe(courseData.typeId);
			expect(response?.data.shift.id).toBe(courseData.shiftId);
			expect(response?.data.campus.id).toBe(courseData.campusId);
		});

		it("should not create a course with repeated code", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			const courseData1 = await generateUniqueCourse();
			const courseData2 = await generateUniqueCourse();
			await expectRequestSuccess(201, () => api.post("/course", courseData1, authHeaders(token)));
			await expectRequestFail(409, () =>
				api.post("/course", { ...courseData2, code: courseData1.code }, authHeaders(token)),
			);
		});
	});
});

describe("PATCH /course/:id", () => {
	describe("No auth", () => {
		it("should not update courses", async () => {
			await expectRequestFail(401, () => api.patch(`/course/${1}`, {}));
		});
	});

	describe("Normal user", () => {
		it("should not update courses", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.patch(`/course/${1}`, {}, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should update any field from any course", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			const course1 = await CourseRepository.create(await generateUniqueCourse());
			const course2Data = await generateUniqueCourse();
			const response = await expectRequestSuccess(200, () =>
				api.patch(`/course/${course1.id}`, course2Data, authHeaders(token)),
			);

			expect(response?.data.id).toBe(course1.id);
			expect(response?.data.code).toBe(course2Data.code);
			expect(response?.data.name).toBe(course2Data.name);
			expect(response?.data.type.id).toBe(course2Data.typeId);
			expect(response?.data.shift.id).toBe(course2Data.shiftId);
			expect(response?.data.campus.id).toBe(course2Data.campusId);
		});

		it("should not update an invalid couse (12345678)", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.patch(`/course/${12345678}`, {}, authHeaders(token)));
		});
	});
});

describe("DELETE /course/:id", () => {
	describe("No auth", () => {
		it("should not delete courses", async () => {
			await expectRequestFail(401, () => api.delete(`/course/${1}`));
		});
	});

	describe("Normal user", () => {
		it("should not delete courses", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.delete(`/course/${1}`, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should delete existing course just once", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			const course = await CourseRepository.create(await generateUniqueCourse());
			await expectRequestSuccess(204, () => api.delete(`/course/${course.id}`, authHeaders(token)));
			await expectRequestFail(404, () => api.delete(`/course/${course.id}`, authHeaders(token)));
		});

		it("should not delete an invalid course (12345678)", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.delete(`/course/${12345678}`, authHeaders(token)));
		});
	});
});
