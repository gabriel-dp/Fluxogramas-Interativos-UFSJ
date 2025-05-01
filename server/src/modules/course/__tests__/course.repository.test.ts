import CourseRepository from "../course.repository";

import TypeRepository from "../type/type.repository";
import { generateUniqueType } from "../type/__tests__/type.repository.test";
import CampusRepository from "../campus/campus.repository";
import { generateUniqueCampus } from "../campus/__tests__/campus.repository.test";
import ShiftRepository from "../shift/shift.repository";
import { generateUniqueShift } from "../shift/__tests__/shift.repository.test";

export async function generateUniqueCourse(): Promise<{
	code: string;
	name: string;
	hours: number;
	campusId: number;
	shiftId: number;
	typeId: number;
}> {
	const type = await TypeRepository.create(generateUniqueType());
	const campus = await CampusRepository.create(generateUniqueCampus());
	const shift = await ShiftRepository.create(generateUniqueShift());
	return {
		code: String(process.hrtime.bigint()),
		name: "Teste",
		hours: 0,
		campusId: campus.id,
		shiftId: shift.id,
		typeId: type.id,
	};
}

describe("CourseRepository", () => {
	it("should create necessary entities", async () => {
		await TypeRepository.create(generateUniqueType());
		await CampusRepository.create(generateUniqueCampus());
		await ShiftRepository.create(generateUniqueShift());
	});

	it("should create and read many courses", async () => {
		const coursesData = await Promise.all(Array.from({ length: 10 }).map(() => generateUniqueCourse()));
		await Promise.all(coursesData.map((course) => CourseRepository.create(course)));

		const courses = await CourseRepository.getAll();
		expect(courses.length).toBeGreaterThanOrEqual(coursesData.length);

		coursesData.forEach(async (data) => {
			expect(courses.filter((course) => course.code == data.code).length).toBe(1);
		});
	});

	it("should create and fetch a course", async () => {
		const data = await generateUniqueCourse();

		const course = await CourseRepository.create(data);
		expect(course).not.toBeNull();

		const fetched = await CourseRepository.getOne(course.id);
		expect(fetched).not.toBeNull();
		expect(fetched?.code).toBe(data.code);
	});

	it("should not fetch an invalid course (99999)", async () => {
		const course = await CourseRepository.getOne(99999);
		expect(course).toBeNull();
	});

	it("should update a course data", async () => {
		const dataOriginal = await generateUniqueCourse();
		const dataNew = await generateUniqueCourse();

		const course = await CourseRepository.create(dataOriginal);
		expect(course).not.toBeNull();

		const updated = await CourseRepository.update(course.id, dataNew);
		expect(updated.id).toBe(course.id);

		const fetched = await CourseRepository.getOne(updated.id);
		expect(fetched?.code).toBe(dataNew.code);
	});

	it("should delete a course and not fetch after deleted", async () => {
		const data = await generateUniqueCourse();

		const course = await CourseRepository.create(data);
		expect(course).not.toBeNull();

		const deleted = await CourseRepository.delete(course.id);
		expect(deleted.id).toBe(course.id);

		const fetched = await CourseRepository.getOne(deleted.id);
		expect(fetched).toBeNull();
	});

	it("should fetch a course by its code", async () => {
		const data = await generateUniqueCourse();

		const course = await CourseRepository.create(data);
		expect(course).not.toBeNull();

		const fetched = await CourseRepository.getOneByCode(course.code);
		expect(fetched).not.toBeNull();
		expect(fetched?.id).toBe(course.id);
		expect(fetched?.code).toBe(course.code);
	});
});
