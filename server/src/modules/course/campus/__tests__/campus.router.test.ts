import { ADMIN_CREDENTIALS, NORMAL_CREDENTIALS, signIn } from "../../../../utils/tests/tests.credentials";
import { api, authHeaders, expectRequestFail, expectRequestSuccess } from "../../../../utils/tests/tests.requests";
import CampusService from "../campus.service";
import { generateUniqueCampus } from "./campus.repository.test";

describe("POST /course/campus", () => {
	describe("No auth", () => {
		it("should not create campuses", async () => {
			await expectRequestFail(401, () => api.post("/course/campus", {}));
		});
	});

	describe("Normal user", () => {
		it("should not create campuses", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.post("/course/campus", {}, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should create and read many campuses (10)", async () => {
			const campusesData = Array.from({ length: 10 }, () => generateUniqueCampus());
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await Promise.all(
				campusesData.map((campus) =>
					expectRequestSuccess(201, () => api.post("/course/campus", campus, authHeaders(token))),
				),
			);

			const campuses = await CampusService.getAll();
			expect(campuses.length).toBeGreaterThanOrEqual(campusesData.length);

			campusesData.forEach(async (data) => {
				expect(campuses.filter((campus) => campus.name == data.name).length).toBe(1);
			});
		});

		it("should not create a campus with repeated code", async () => {
			const data = generateUniqueCampus();

			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(201, () => api.post("/course/campus", data, authHeaders(token)));
			await expectRequestFail(409, () => api.post("/course/campus", data, authHeaders(token)));
		});
	});
});

describe("GET /course/campus", () => {
	it("should retrieve data from all avaliable campuses", async () => {
		const response = await expectRequestSuccess(200, () => api.get("/course/campus"));

		const campuses: object[] = response?.data;
		campuses.forEach((campus: object) => {
			expect(campus).toHaveProperty("name");
		});
	});
});

describe("GET /course/campus/:id", () => {
	it("should retrieve data from a single campus", async () => {
		const campus = await CampusService.create(generateUniqueCampus());

		const response = await expectRequestSuccess(200, () => api.get(`/course/campus/${campus.id}`));
		expect(response?.data).toHaveProperty("name");
	});

	it("should not retrieve data from an invalid campus (12345678)", async () => {
		await expectRequestFail(404, () => api.get(`/course/campus/${12345678}`));
	});
});

describe("PATCH /course/campus/:id", () => {
	describe("No auth", () => {
		it("should not update campus", async () => {
			await expectRequestFail(401, () => api.patch(`/course/campus/${1}`, {}));
		});
	});

	describe("Normal user", () => {
		it("should not update campus", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.patch(`/course/campus/${1}`, {}, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should update any field from any course", async () => {
			const data1 = generateUniqueCampus();
			const data2 = generateUniqueCampus();
			const campus = await CampusService.create(data1);

			const { token } = await signIn(ADMIN_CREDENTIALS);
			const response = await expectRequestSuccess(200, () =>
				api.patch(`/course/campus/${campus.id}`, data2, authHeaders(token)),
			);

			expect(response?.data).toBeDefined();
			expect(response?.data.name).toBe(data2.name);
		});

		it("should not update an invalid couse (12345678)", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.patch(`/course/campus/${12345678}`, {}, authHeaders(token)));
		});
	});
});

describe("DELETE /course/campus/:id", () => {
	describe("No auth", () => {
		it("should not delete campuses", async () => {
			await expectRequestFail(401, () => api.delete(`/course/campus/${1}`));
		});
	});

	describe("Normal user", () => {
		it("should not delete campuses", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.delete(`/course/campus/${1}`, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should delete existing campus", async () => {
			const campus = await CampusService.create(generateUniqueCampus());

			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(204, () => api.delete(`/course/campus/${campus.id}`, authHeaders(token)));
		});

		it("should not delete campus more than once", async () => {
			const campus = await CampusService.create(generateUniqueCampus());

			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(204, () => api.delete(`/course/campus/${campus.id}`, authHeaders(token)));
			await expectRequestFail(404, () => api.delete(`/course/campus/${campus.id}`, authHeaders(token)));
		});

		it("should not delete an invalid campus (12345678)", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.delete(`/course/campus/${12345678}`, authHeaders(token)));
		});
	});
});
