import ShiftRepository from "../shift.repository";

function generateUniqueShift(): { name: string } {
	return { name: `shift${process.hrtime.bigint()}` };
}

describe("ShiftRepository", () => {
	it("should create and read many shifts (10)", async () => {
		const shiftsData = Array.from({ length: 10 }, () => generateUniqueShift());
		await Promise.all(shiftsData.map((shift) => ShiftRepository.create(shift)));

		const shifts = await ShiftRepository.getAll();
		expect(shifts.length).toBeGreaterThanOrEqual(shiftsData.length);

		shiftsData.forEach(async (data) => {
			expect(shifts.filter((shift) => shift.name == data.name).length).toBe(1);
		});
	});

	it("should create and fetch a shift", async () => {
		const data = generateUniqueShift();

		const shift = await ShiftRepository.create(data);
		expect(shift).not.toBeNull();

		const fetched = await ShiftRepository.getOne(shift.id);
		expect(fetched).not.toBeNull();
		expect(fetched?.name).toBe(data.name);
	});

	it("should not fetch an invalid user (99999)", async () => {
		const user = await ShiftRepository.getOne(99999);
		expect(user).toBeNull();
	});

	it("should update a shift data", async () => {
		const dataOriginal = generateUniqueShift();
		const dataNew = generateUniqueShift();

		const shift = await ShiftRepository.create(dataOriginal);
		expect(shift).not.toBeNull();

		const updated = await ShiftRepository.update(shift.id, dataNew);
		expect(updated.id).toBe(shift.id);

		const fetched = await ShiftRepository.getOne(updated.id);
		expect(fetched?.name).toBe(dataNew.name);
	});

	it("should delete a shift and not fetch after deleted", async () => {
		const data = generateUniqueShift();

		const shift = await ShiftRepository.create(data);
		expect(shift).not.toBeNull();

		const deleted = await ShiftRepository.delete(shift.id);
		expect(deleted.id).toBe(shift.id);

		const fetched = await ShiftRepository.getOne(deleted.id);
		expect(fetched).toBeNull();
	});

	it("should fetch a shift by its name", async () => {
		const data = generateUniqueShift();

		const shift = await ShiftRepository.create(data);
		expect(shift).not.toBeNull();

		const fetched = await ShiftRepository.getOneByName(shift.name);
		expect(fetched).not.toBeNull();
		expect(fetched?.id).toBe(shift.id);
		expect(fetched?.name).toBe(shift.name);
	});
});
