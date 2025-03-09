import { User } from "@/models/user.model";
import { api, expectFail, expectSuccess, fail, signInToken } from "./utils.tests";
import { ADMIN_CREDENTIALS, ADMIN_ID, NORMAL_CREDENTIALS, NORMAL_ID } from "./consts.tests";

describe("GET /user", () => {
	describe("Without auth", () => {
		it("should not retrieve data from all users", async () => {
			await expectFail(401, () => api.get("/user"));
		});
	});

	describe("Without admin privileges", () => {
		it("should not retrieve data from all users", async () => {
			const token = await signInToken(NORMAL_CREDENTIALS);
			await expectFail(403, () =>
				api.get("/user", {
					headers: {
						authorization: `Bearer ${token}`,
					},
				})
			);
		});
	});

	describe("With admin privileges", () => {
		let usersList: User[] = [];

		it("should retrieve data from all users as an admin", async () => {
			const token = await signInToken(ADMIN_CREDENTIALS);
			const response = await expectSuccess(200, () =>
				api.get("/user", {
					headers: {
						authorization: `Bearer ${token}`,
					},
				})
			);
			usersList = response?.data;
		});

		it("should not be able to view password field", async () => {
			usersList.forEach((user) => {
				if ("password" in user) {
					fail("password should be omited");
				}
			});
		});
	});
});

describe("GET /user/:id", () => {
	describe("Without auth", () => {
		it("should not retrieve user data", async () => {
			await expectFail(401, () => api.get(`/user/${NORMAL_ID}`));
		});
	});

	describe("Without admin privileges", () => {
		it("should retrieve its own data", async () => {
			const token = await signInToken(NORMAL_CREDENTIALS);
			await expectSuccess(200, () =>
				api.get(`/user/${NORMAL_ID}`, {
					headers: {
						authorization: `Bearer ${token}`,
					},
				})
			);
		});

		it("should not retrieve other users data", async () => {
			const token = await signInToken(NORMAL_CREDENTIALS);
			await expectFail(403, () =>
				api.get(`/user/${ADMIN_ID}`, {
					headers: {
						authorization: `Bearer ${token}`,
					},
				})
			);
		});
	});

	describe("With admin privileges", () => {
		it("should retrieve its own data", async () => {
			const token = await signInToken(ADMIN_CREDENTIALS);
			await expectSuccess(200, () =>
				api.get(`/user/${ADMIN_ID}`, {
					headers: {
						authorization: `Bearer ${token}`,
					},
				})
			);
		});

		it("should retrieve other users data", async () => {
			const token = await signInToken(ADMIN_CREDENTIALS);
			await expectSuccess(200, () =>
				api.get(`/user/${NORMAL_ID}`, {
					headers: {
						authorization: `Bearer ${token}`,
					},
				})
			);
		});
	});
});
