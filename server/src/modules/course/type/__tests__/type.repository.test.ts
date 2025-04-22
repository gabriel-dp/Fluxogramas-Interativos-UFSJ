import TypeRepository from "../type.repository";

function generateUniqueType(): { name: string } {
	return { name: `type${process.hrtime.bigint()}` };
}

describe("TypeRepository", () => {
	it("should create and read many types (10)", async () => {
		const typesData = Array.from({ length: 10 }, () => generateUniqueType());
		await Promise.all(typesData.map((type) => TypeRepository.create(type)));

		const types = await TypeRepository.getAll();
		expect(types.length).toBeGreaterThanOrEqual(typesData.length);

		typesData.forEach(async (data) => {
			expect(types.filter((type) => type.name == data.name).length).toBe(1);
		});
	});

	it("should create and fetch a type", async () => {
		const data = generateUniqueType();

		const type = await TypeRepository.create(data);
		expect(type).not.toBeNull();

		const fetched = await TypeRepository.getOne(type.id);
		expect(fetched).not.toBeNull();
		expect(fetched?.name).toBe(data.name);
	});

	it("should not fetch an invalid user (99999)", async () => {
		const user = await TypeRepository.getOne(99999);
		expect(user).toBeNull();
	});

	it("should update a type data", async () => {
		const dataOriginal = generateUniqueType();
		const dataNew = generateUniqueType();

		const type = await TypeRepository.create(dataOriginal);
		expect(type).not.toBeNull();

		const updated = await TypeRepository.update(type.id, dataNew);
		expect(updated.id).toBe(type.id);

		const fetched = await TypeRepository.getOne(updated.id);
		expect(fetched?.name).toBe(dataNew.name);
	});

	it("should delete a type and not fetch after deleted", async () => {
		const data = generateUniqueType();

		const type = await TypeRepository.create(data);
		expect(type).not.toBeNull();

		const deleted = await TypeRepository.delete(type.id);
		expect(deleted.id).toBe(type.id);

		const fetched = await TypeRepository.getOne(deleted.id);
		expect(fetched).toBeNull();
	});

	it("should fetch a type by its name", async () => {
		const data = generateUniqueType();

		const type = await TypeRepository.create(data);
		expect(type).not.toBeNull();

		const fetched = await TypeRepository.getOneByName(type.name);
		expect(fetched).not.toBeNull();
		expect(fetched?.id).toBe(type.id);
		expect(fetched?.name).toBe(type.name);
	});
});
