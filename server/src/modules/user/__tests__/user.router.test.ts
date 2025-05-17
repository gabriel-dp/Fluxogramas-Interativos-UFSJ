import { api, authHeaders, expectRequestFail, expectRequestSuccess } from "@/utils/tests/tests.requests";
import {
	ADMIN_CREDENTIALS,
	NORMAL_CREDENTIALS,
	generateNewUserData,
	generateUniqueUsername,
	signIn,
} from "@/utils/tests/tests.credentials";

import UserService from "../user.service";

describe("GET /user", () => {
	describe("No auth", () => {
		it("should not retrieve data from all users", async () => {
			await expectRequestFail(401, () => api.get("/user"));
		});
	});

	describe("Normal user", () => {
		it("should not retrieve data from all users", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.get("/user", authHeaders(token)));
		});
	});

	describe("Admin", () => {
		let usersList: object[] = [];

		it("should retrieve data from all users", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			const response = await expectRequestSuccess(200, () => api.get("/user", authHeaders(token)));
			usersList = response?.data;
		});

		it("should not be able to view password field", async () => {
			usersList.forEach((user) => {
				expect(user).not.toHaveProperty("password");
			});
		});
	});
});

describe("GET /user/:id", () => {
	describe("No auth", () => {
		it("should not retrieve user data", async () => {
			await expectRequestFail(401, () => api.get(`/user/${1}`));
		});
	});

	describe("Normal user", () => {
		it("should retrieve its own data", async () => {
			const { id, token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestSuccess(200, () => api.get(`/user/${id}`, authHeaders(token)));
		});

		it("should not retrieve other users data", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.get(`/user/${1}`, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		let userData;

		it("should retrieve its own data", async () => {
			const { id, token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(200, () => api.get(`/user/${id}`, authHeaders(token)));
		});

		it("should retrieve other users data", async () => {
			const { token: tokenAdmin } = await signIn(ADMIN_CREDENTIALS);
			const { id: idNormal } = await signIn(NORMAL_CREDENTIALS);
			const response = await expectRequestSuccess(200, () => api.get(`/user/${idNormal}`, authHeaders(tokenAdmin)));

			userData = response?.data;
			expect(userData).not.toHaveProperty("password");
		});

		it("should not retrieve an invalid user (12345678)", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.get(`/user/${12345678}`, authHeaders(token)));
		});
	});
});

describe("POST /user", () => {
	describe("No auth", () => {
		it("should not create users", async () => {
			await expectRequestFail(401, () => api.post("/user", {}));
		});
	});

	describe("Normal user", () => {
		it("should not create users", async () => {
			const { token } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(403, () => api.post("/user", {}, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		const username = generateNewUserData();

		it("should create user", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestSuccess(201, () => api.post("/user", username, authHeaders(token)));
		});

		it("should not create users with repeated username", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(409, () => api.post("/user", username, authHeaders(token)));
		});
	});
});

describe("PATCH /user/:id", () => {
	describe("No auth", () => {
		it("should not be able to update", async () => {
			await expectRequestFail(401, () => api.get(`/user/${1}`));
		});
	});

	describe("Normal user", () => {
		const usernameOriginal = generateNewUserData();
		const usernameUpdate = generateNewUserData();

		it("should update its own data", async () => {
			await UserService.create(usernameOriginal);

			const { id, token } = await signIn(usernameOriginal);
			await expectRequestSuccess(200, () => api.patch(`/user/${id}`, usernameUpdate, authHeaders(token)));
		});

		it("should username only with new credentials", async () => {
			await expect(signIn(usernameUpdate)).resolves.toBeDefined();
			await expect(signIn(usernameOriginal)).rejects.toThrow();
		});

		it("should update its own data (reset to original)", async () => {
			const { id, token } = await signIn(usernameUpdate);
			await expectRequestSuccess(200, () => api.patch(`/user/${id}`, usernameOriginal, authHeaders(token)));
		});

		it("should username only with the new credentials (reseted to original)", async () => {
			await expect(signIn(usernameOriginal)).resolves.toBeDefined();
			await expect(signIn(usernameUpdate)).rejects.toThrow();
		});

		it("should not make users admin", async () => {
			const { id, token } = await signIn(usernameOriginal);
			await expectRequestFail(403, () => api.patch(`/user/${id}`, { isAdmin: true }, authHeaders(token)));
		});

		it("should not update other users data", async () => {
			const { token: tokenNormal } = await signIn(NORMAL_CREDENTIALS);
			const { id: idAdmin } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(403, () => api.get(`/user/${idAdmin}`, authHeaders(tokenNormal)));
		});
	});

	describe("Admin", () => {
		const usernameOriginal = generateNewUserData();
		const usernameUpdate = generateNewUserData();

		it("should update data of other users and make admin", async () => {
			await UserService.create(usernameOriginal);

			const { token: tokenAdmin } = await signIn(ADMIN_CREDENTIALS);
			const { id: idNormal } = await signIn(usernameOriginal);
			await expectRequestSuccess(200, () =>
				api.patch(
					`/user/${idNormal}`,
					{
						...usernameUpdate,
						isAdmin: true,
					},
					authHeaders(tokenAdmin)
				)
			);
		});

		it("should username only with new credentials", async () => {
			await expect(signIn(usernameUpdate)).resolves.toBeDefined();
			await expect(signIn(usernameOriginal)).rejects.toThrow();
		});

		it("should update data of other users (reset to original)", async () => {
			const { token: tokenAdmin } = await signIn(ADMIN_CREDENTIALS);
			const { id: idNormal } = await signIn(usernameUpdate);
			await expectRequestSuccess(200, () =>
				api.patch(`/user/${idNormal}`, { ...usernameOriginal, isAdmin: false }, authHeaders(tokenAdmin))
			);
		});

		it("should username only with the new credentials (reseted to original)", async () => {
			await expect(signIn(usernameOriginal)).resolves.toBeDefined();
			await expect(signIn(usernameUpdate)).rejects.toThrow();
		});

		it("should not update an invalid user (12345678)", async () => {
			const { token } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () =>
				api.patch(`/user/${12345678}`, { username: generateUniqueUsername() }, authHeaders(token))
			);
		});

		it("should not update username to another existing", async () => {
			const { token: tokenAdmin } = await signIn(ADMIN_CREDENTIALS);
			const { id: idNormal } = await signIn(NORMAL_CREDENTIALS);
			await expectRequestFail(409, () =>
				api.patch(`/user/${idNormal}`, { username: ADMIN_CREDENTIALS.username }, authHeaders(tokenAdmin))
			);
		});
	});
});

describe("DELETE /user/:id", () => {
	describe("No auth", () => {
		it("should not be able to delete", async () => {
			await expectRequestFail(401, () => api.delete(`/user/${1}`));
		});
	});

	describe("Normal user", () => {
		const usernameToNotDelete = generateNewUserData();

		it("should not be able to delete", async () => {
			await UserService.create(usernameToNotDelete);
			const { id, token } = await signIn(usernameToNotDelete);
			await expectRequestFail(403, () => api.delete(`/user/${id}`, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		const usernameToDelete = generateNewUserData();
		let idToDelete: number;

		it("should be able to delete users", async () => {
			await UserService.create(usernameToDelete);

			const { token: tokenAdmin } = await signIn(ADMIN_CREDENTIALS);
			idToDelete = (await signIn(usernameToDelete)).id;
			await expectRequestSuccess(204, () => api.delete(`/user/${idToDelete}`, authHeaders(tokenAdmin)));
		});

		it("should not delete a user more than once", async () => {
			const { token: tokenAdmin } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.delete(`/user/${idToDelete}`, authHeaders(tokenAdmin)));
		});

		it("should not delete an invalid user (12345678)", async () => {
			const { token: tokenAdmin } = await signIn(ADMIN_CREDENTIALS);
			await expectRequestFail(404, () => api.delete(`/user/${12345678}`, authHeaders(tokenAdmin)));
		});
	});
});
