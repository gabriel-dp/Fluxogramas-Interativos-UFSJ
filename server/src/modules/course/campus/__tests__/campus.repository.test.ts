import CampusRepository from "../campus.repository";

export function generateUniqueCampus(): { name: string } {
	return { name: `campus${process.hrtime.bigint()}` };
}

describe("CampusRepository", () => {
	it("should create and read many campuses (10)", async () => {
		const campusesData = Array.from({ length: 10 }, () => generateUniqueCampus());
		await Promise.all(campusesData.map((campus) => CampusRepository.create(campus)));

		const campuses = await CampusRepository.getAll();
		expect(campuses.length).toBeGreaterThanOrEqual(campusesData.length);

		campusesData.forEach(async (data) => {
			expect(campuses.filter((campus) => campus.name == data.name).length).toBe(1);
		});
	});

	it("should create and fetch a campus", async () => {
		const data = generateUniqueCampus();

		const campus = await CampusRepository.create(data);
		expect(campus).not.toBeNull();

		const fetched = await CampusRepository.getOne(campus.id);
		expect(fetched).not.toBeNull();
		expect(fetched?.name).toBe(data.name);
	});

	it("should not fetch an invalid user (99999)", async () => {
		const user = await CampusRepository.getOne(99999);
		expect(user).toBeNull();
	});

	it("should update a campus data", async () => {
		const dataOriginal = generateUniqueCampus();
		const dataNew = generateUniqueCampus();

		const campus = await CampusRepository.create(dataOriginal);
		expect(campus).not.toBeNull();

		const updated = await CampusRepository.update(campus.id, dataNew);
		expect(updated.id).toBe(campus.id);

		const fetched = await CampusRepository.getOne(updated.id);
		expect(fetched?.name).toBe(dataNew.name);
	});

	it("should delete a campus and not fetch after deleted", async () => {
		const data = generateUniqueCampus();

		const campus = await CampusRepository.create(data);
		expect(campus).not.toBeNull();

		const deleted = await CampusRepository.delete(campus.id);
		expect(deleted.id).toBe(campus.id);

		const fetched = await CampusRepository.getOne(deleted.id);
		expect(fetched).toBeNull();
	});

	it("should fetch a campus by its name", async () => {
		const data = generateUniqueCampus();

		const campus = await CampusRepository.create(data);
		expect(campus).not.toBeNull();

		const fetched = await CampusRepository.getOneByName(campus.name);
		expect(fetched).not.toBeNull();
		expect(fetched?.id).toBe(campus.id);
		expect(fetched?.name).toBe(campus.name);
	});
});
