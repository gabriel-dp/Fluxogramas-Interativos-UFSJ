import TypeService from "../type.service";

function generateUniqueType(): { name: string } {
	return { name: `type${process.hrtime.bigint()}` };
}

describe("TypeService", () => {
	it("should create and read many types (10)", async () => {
		const typesData = Array.from({ length: 10 }, () => generateUniqueType());
		await Promise.all(typesData.map((type) => TypeService.create(type)));

		const types = await TypeService.getAll();
		expect(types.length).toBeGreaterThanOrEqual(typesData.length);

		typesData.forEach(async (data) => {
			expect(types.filter((type) => type.name == data.name).length).toBe(1);
		});
	});

	it("should create and fetch a type", async () => {
		const data = generateUniqueType();

		const type = await TypeService.create(data);
		expect(type).not.toBeNull();

		const fetched = await TypeService.getOne(type.id);
		expect(fetched.id).toBe(type.id);
	});

	it("should not fetch an invalid type (99999)", async () => {
		await expect(TypeService.getOne(99999)).rejects.toThrow();
	});

	it("should update a type data", async () => {
		const dataOriginal = generateUniqueType();
		const dataNew = generateUniqueType();

		const type = await TypeService.create(dataOriginal);
		expect(type).not.toBeNull();

		const updated = await TypeService.update(type.id, { ...dataNew });
		expect(updated.id).toBe(type.id);

		const fetched = await TypeService.getOne(updated.id);
		expect(fetched.name).toBe(dataNew.name);
	});

	it("should delete a type and not fetch after deleted", async () => {
		const data = generateUniqueType();

		const type = await TypeService.create(data);
		expect(type).not.toBeNull();

		const deleted = await TypeService.delete(type.id);
		expect(deleted.id).toBe(type.id);

		await expect(TypeService.getOne(deleted.id)).rejects.toThrow();
	});

	it("should not create types with same name", async () => {
		const data1 = generateUniqueType();
		const data2 = generateUniqueType();

		const type = await TypeService.create(data1);
		await expect(TypeService.create({ ...data2, name: type.name })).rejects.toThrow();
	});

	it("should not update type login to an existing one", async () => {
		const data1 = generateUniqueType();
		const data2 = generateUniqueType();

		await TypeService.create(data1);
		const type = await TypeService.create(data2);

		await expect(TypeService.update(type.id, data1)).rejects.toThrow();
	});
});
