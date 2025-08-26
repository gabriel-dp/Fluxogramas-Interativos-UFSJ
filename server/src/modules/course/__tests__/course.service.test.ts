import CourseService from "../course.service";

import { generateUniqueCourse } from "./course.repository.test";

describe("CourseService", () => {
	it("should create and read many courses (10)", async () => {
		const coursesData = await Promise.all(Array.from({ length: 10 }).map(() => generateUniqueCourse()));
		await Promise.all(coursesData.map((course) => CourseService.create(course)));

		const courses = await CourseService.getAll();
		expect(courses.length).toBeGreaterThanOrEqual(coursesData.length);

		coursesData.forEach(async (data) => {
			expect(courses.filter((course) => course.code == data.code).length).toBe(1);
		});
	});

	it("should create and fetch a course", async () => {
		const data = await generateUniqueCourse();

		const course = await CourseService.create(data);
		expect(course).not.toBeNull();

		const fetched = await CourseService.getOne(course.id);
		expect(fetched.id).toBe(course.id);
	});

	it("should not fetch an invalid course (99999)", async () => {
		await expect(CourseService.getOne(99999)).rejects.toThrow();
	});

	it("should update a course data", async () => {
		const dataOriginal = await generateUniqueCourse();
		const dataNew = await generateUniqueCourse();

		const course = await CourseService.create(dataOriginal);
		expect(course).not.toBeNull();

		const updated = await CourseService.update(course.id, { ...dataNew });
		expect(updated.id).toBe(course.id);

		const fetched = await CourseService.getOne(updated.id);
		expect(fetched.name).toBe(dataNew.name);
	});

	it("should delete a course and not fetch after deleted", async () => {
		const data = await generateUniqueCourse();

		const course = await CourseService.create(data);
		expect(course).not.toBeNull();

		const deleted = await CourseService.delete(course.id);
		expect(deleted.id).toBe(course.id);

		await expect(CourseService.getOne(deleted.id)).rejects.toThrow();
	});

	it("should not create courses with same code", async () => {
		const data1 = await generateUniqueCourse();
		const data2 = await generateUniqueCourse();

		const course = await CourseService.create(data1);
		await expect(CourseService.create({ ...data2, code: course.code })).rejects.toThrow();
	});

	it("should not update course code to an existing one", async () => {
		const data1 = await generateUniqueCourse();
		const data2 = await generateUniqueCourse();

		await CourseService.create(data1);
		const course = await CourseService.create(data2);

		await expect(CourseService.update(course.id, data1)).rejects.toThrow();
	});
});
