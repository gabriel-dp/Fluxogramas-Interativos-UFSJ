import CampusService from "../campus.service";

function generateUniqueCampus(): { name: string } {
	return { name: `campus${process.hrtime.bigint()}` };
}

describe("CampusService", () => {
	it("should create and read many campuses (10)", async () => {
		const campusesData = Array.from({ length: 10 }, () => generateUniqueCampus());
		await Promise.all(campusesData.map((campus) => CampusService.create(campus)));

		const campuses = await CampusService.getAll();
		expect(campuses.length).toBeGreaterThanOrEqual(campusesData.length);

		campusesData.forEach(async (data) => {
			expect(campuses.filter((campus) => campus.name == data.name).length).toBe(1);
		});
	});

	it("should create and fetch a campus", async () => {
		const data = generateUniqueCampus();

		const campus = await CampusService.create(data);
		expect(campus).not.toBeNull();

		const fetched = await CampusService.getOne(campus.id);
		expect(fetched.id).toBe(campus.id);
	});

	it("should not fetch an invalid campus (99999)", async () => {
		await expect(CampusService.getOne(99999)).rejects.toThrow();
	});

	it("should update a campus data", async () => {
		const dataOriginal = generateUniqueCampus();
		const dataNew = generateUniqueCampus();

		const campus = await CampusService.create(dataOriginal);
		expect(campus).not.toBeNull();

		const updated = await CampusService.update(campus.id, { ...dataNew });
		expect(updated.id).toBe(campus.id);

		const fetched = await CampusService.getOne(updated.id);
		expect(fetched.name).toBe(dataNew.name);
	});

	it("should delete a campus and not fetch after deleted", async () => {
		const data = generateUniqueCampus();

		const campus = await CampusService.create(data);
		expect(campus).not.toBeNull();

		const deleted = await CampusService.delete(campus.id);
		expect(deleted.id).toBe(campus.id);

		await expect(CampusService.getOne(deleted.id)).rejects.toThrow();
	});

	it("should not create campuses with same name", async () => {
		const data1 = generateUniqueCampus();
		const data2 = generateUniqueCampus();

		const campus = await CampusService.create(data1);
		await expect(CampusService.create({ ...data2, name: campus.name })).rejects.toThrow();
	});

	it("should not update campus login to an existing one", async () => {
		const data1 = generateUniqueCampus();
		const data2 = generateUniqueCampus();

		await CampusService.create(data1);
		const campus = await CampusService.create(data2);

		await expect(CampusService.update(campus.id, data1)).rejects.toThrow();
	});
});
