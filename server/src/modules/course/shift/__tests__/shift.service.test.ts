import ShiftService from "../shift.service";

import { generateUniqueShift } from "./shift.repository.test";

describe("ShiftService", () => {
	it("should create and read many shifts (10)", async () => {
		const shiftsData = Array.from({ length: 10 }, () => generateUniqueShift());
		await Promise.all(shiftsData.map((shift) => ShiftService.create(shift)));

		const shifts = await ShiftService.getAll();
		expect(shifts.length).toBeGreaterThanOrEqual(shiftsData.length);

		shiftsData.forEach(async (data) => {
			expect(shifts.filter((shift) => shift.name == data.name).length).toBe(1);
		});
	});

	it("should create and fetch a shift", async () => {
		const data = generateUniqueShift();

		const shift = await ShiftService.create(data);
		expect(shift).not.toBeNull();

		const fetched = await ShiftService.getOne(shift.id);
		expect(fetched.id).toBe(shift.id);
	});

	it("should not fetch an invalid shift (99999)", async () => {
		await expect(ShiftService.getOne(99999)).rejects.toThrow();
	});

	it("should update a shift data", async () => {
		const dataOriginal = generateUniqueShift();
		const dataNew = generateUniqueShift();

		const shift = await ShiftService.create(dataOriginal);
		expect(shift).not.toBeNull();

		const updated = await ShiftService.update(shift.id, { ...dataNew });
		expect(updated.id).toBe(shift.id);

		const fetched = await ShiftService.getOne(updated.id);
		expect(fetched.name).toBe(dataNew.name);
	});

	it("should delete a shift and not fetch after deleted", async () => {
		const data = generateUniqueShift();

		const shift = await ShiftService.create(data);
		expect(shift).not.toBeNull();

		const deleted = await ShiftService.delete(shift.id);
		expect(deleted.id).toBe(shift.id);

		await expect(ShiftService.getOne(deleted.id)).rejects.toThrow();
	});

	it("should not create shifts with same name", async () => {
		const data1 = generateUniqueShift();
		const data2 = generateUniqueShift();

		const shift = await ShiftService.create(data1);
		await expect(ShiftService.create({ ...data2, name: shift.name })).rejects.toThrow();
	});

	it("should not update shift name to an existing one", async () => {
		const data1 = generateUniqueShift();
		const data2 = generateUniqueShift();

		await ShiftService.create(data1);
		const shift = await ShiftService.create(data2);

		await expect(ShiftService.update(shift.id, data1)).rejects.toThrow();
	});
});
