import { ADMIN_CREDENTIALS, NORMAL_CREDENTIALS, signIn } from "@/utils/tests/tests.credentials";
import { api, authHeaders, expectRequestFail, expectRequestSuccess } from "@/utils/tests/tests.requests";

import TypeService from "../type.service";

function generateUniqueType(): { name: string } {
	return { name: `type${process.hrtime.bigint()}` };
}

describe("POST /course/type", () => {
	describe("No auth", () => {
		it("should not create types", async () => {
			await expectRequestFail(401, () => api.post("/course/type", {}));
		});
	});

	describe("Normal user", () => {
		it("should not create types", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.post("/course/type", {}, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should create and read many types (10)", async () => {
			const typesData = Array.from({ length: 10 }, () => generateUniqueType());
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await Promise.all(
				typesData.map((type) => expectRequestSuccess(201, () => api.post("/course/type", type, authHeaders(token))))
			);

			const types = await TypeService.getAll();
			expect(types.length).toBeGreaterThanOrEqual(typesData.length);

			typesData.forEach(async (data) => {
				expect(types.filter((type) => type.name == data.name).length).toBe(1);
			});
		});

		it("should not create a type with repeated code", async () => {
			const data = generateUniqueType();

			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(201, () => api.post("/course/type", data, authHeaders(token)));
			await expectRequestFail(409, () => api.post("/course/type", data, authHeaders(token)));
		});
	});
});

describe("GET /course/type", () => {
	it("should retrieve data from all avaliable types", async () => {
		const response = await expectRequestSuccess(200, () => api.get("/course/type"));

		const types: object[] = response?.data;
		types.forEach((type: object) => {
			expect(type).toHaveProperty("name");
		});
	});
});

describe("GET /course/type/:id", () => {
	it("should retrieve data from a single type", async () => {
		const type = await TypeService.create(generateUniqueType());

		const response = await expectRequestSuccess(200, () => api.get(`/course/type/${type.id}`));
		expect(response?.data).toHaveProperty("name");
	});

	it("should not retrieve data from an invalid type (12345678)", async () => {
		await expectRequestFail(404, () => api.get(`/course/type/${12345678}`));
	});
});

describe("PATCH /course/type/:id", () => {
	describe("No auth", () => {
		it("should not update type", async () => {
			await expectRequestFail(401, () => api.patch(`/course/type/${1}`, {}));
		});
	});

	describe("Normal user", () => {
		it("should not update type", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.patch(`/course/type/${1}`, {}, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should update any field from any course", async () => {
			const data1 = generateUniqueType();
			const data2 = generateUniqueType();
			const type = await TypeService.create(data1);

			const { token } = await signIn(ADMIN_CREDENTIALS);
			const response = await expectRequestSuccess(200, () =>
				api.patch(`/course/type/${type.id}`, data2, authHeaders(token))
			);

			expect(response?.data).toBeDefined();
			expect(response?.data.name).toBe(data2.name);
		});

		it("should not update an invalid couse (12345678)", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.patch(`/course/type/${12345678}`, {}, authHeaders(token)));
		});
	});
});

describe("DELETE /course/type/:id", () => {
	describe("No auth", () => {
		it("should not delete types", async () => {
			await expectRequestFail(401, () => api.delete(`/course/type/${1}`));
		});
	});

	describe("Normal user", () => {
		it("should not delete types", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.delete(`/course/type/${1}`, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should delete existing type", async () => {
			const type = await TypeService.create(generateUniqueType());

			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(204, () => api.delete(`/course/type/${type.id}`, authHeaders(token)));
		});

		it("should not delete type more than once", async () => {
			const type = await TypeService.create(generateUniqueType());

			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(204, () => api.delete(`/course/type/${type.id}`, authHeaders(token)));
			await expectRequestFail(404, () => api.delete(`/course/type/${type.id}`, authHeaders(token)));
		});

		it("should not delete an invalid type (12345678)", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.delete(`/course/type/${12345678}`, authHeaders(token)));
		});
	});
});
