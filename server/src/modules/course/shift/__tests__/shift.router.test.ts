import { ADMIN_CREDENTIALS, NORMAL_CREDENTIALS, signIn } from "@/utils/tests/tests.credentials";
import { api, authHeaders, expectRequestFail, expectRequestSuccess } from "@/utils/tests/tests.requests";

import ShiftService from "../shift.service";

import { generateUniqueShift } from "./shift.repository.test";

describe("POST /course/shift", () => {
	describe("No auth", () => {
		it("should not create shifts", async () => {
			await expectRequestFail(401, () => api.post("/course/shift", {}));
		});
	});

	describe("Normal user", () => {
		it("should not create shifts", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.post("/course/shift", {}, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should create and read many shifts (10)", async () => {
			const shiftsData = Array.from({ length: 10 }, () => generateUniqueShift());
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await Promise.all(
				shiftsData.map((shift) => expectRequestSuccess(201, () => api.post("/course/shift", shift, authHeaders(token))))
			);

			const shifts = await ShiftService.getAll();
			expect(shifts.length).toBeGreaterThanOrEqual(shiftsData.length);

			shiftsData.forEach(async (data) => {
				expect(shifts.filter((shift) => shift.name == data.name).length).toBe(1);
			});
		});

		it("should not create a shift with repeated code", async () => {
			const data = generateUniqueShift();

			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(201, () => api.post("/course/shift", data, authHeaders(token)));
			await expectRequestFail(409, () => api.post("/course/shift", data, authHeaders(token)));
		});
	});
});

describe("GET /course/shift", () => {
	it("should retrieve data from all avaliable shifts", async () => {
		const response = await expectRequestSuccess(200, () => api.get("/course/shift"));

		const shifts: object[] = response?.data;
		shifts.forEach((shift: object) => {
			expect(shift).toHaveProperty("name");
		});
	});
});

describe("GET /course/shift/:id", () => {
	it("should retrieve data from a single shift", async () => {
		const shift = await ShiftService.create(generateUniqueShift());

		const response = await expectRequestSuccess(200, () => api.get(`/course/shift/${shift.id}`));
		expect(response?.data).toHaveProperty("name");
	});

	it("should not retrieve data from an invalid shift (12345678)", async () => {
		await expectRequestFail(404, () => api.get(`/course/shift/${12345678}`));
	});
});

describe("PATCH /course/shift/:id", () => {
	describe("No auth", () => {
		it("should not update shift", async () => {
			await expectRequestFail(401, () => api.patch(`/course/shift/${1}`, {}));
		});
	});

	describe("Normal user", () => {
		it("should not update shift", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.patch(`/course/shift/${1}`, {}, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should update any field from any course", async () => {
			const data1 = generateUniqueShift();
			const data2 = generateUniqueShift();
			const shift = await ShiftService.create(data1);

			const { token } = await signIn(ADMIN_CREDENTIALS);
			const response = await expectRequestSuccess(200, () =>
				api.patch(`/course/shift/${shift.id}`, data2, authHeaders(token))
			);

			expect(response?.data).toBeDefined();
			expect(response?.data.name).toBe(data2.name);
		});

		it("should not update an invalid couse (12345678)", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.patch(`/course/shift/${12345678}`, {}, authHeaders(token)));
		});
	});
});

describe("DELETE /course/shift/:id", () => {
	describe("No auth", () => {
		it("should not delete shifts", async () => {
			await expectRequestFail(401, () => api.delete(`/course/shift/${1}`));
		});
	});

	describe("Normal user", () => {
		it("should not delete shifts", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.delete(`/course/shift/${1}`, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		it("should delete existing shift", async () => {
			const shift = await ShiftService.create(generateUniqueShift());

			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(204, () => api.delete(`/course/shift/${shift.id}`, authHeaders(token)));
		});

		it("should not delete shift more than once", async () => {
			const shift = await ShiftService.create(generateUniqueShift());

			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(204, () => api.delete(`/course/shift/${shift.id}`, authHeaders(token)));
			await expectRequestFail(404, () => api.delete(`/course/shift/${shift.id}`, authHeaders(token)));
		});

		it("should not delete an invalid shift (12345678)", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.delete(`/course/shift/${12345678}`, authHeaders(token)));
		});
	});
});
