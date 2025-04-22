import { api, authHeaders, expectRequestFail, expectRequestSuccess } from "@/utils/tests/tests.requests";
import {
	Credentials,
	ADMIN_CREDENTIALS,
	NORMAL_CREDENTIALS,
	generateNewUserData,
	generateUniqueLogin,
} from "@/utils/tests/tests.credentials";

import UserService from "../user.service";

async function signIn(credentials: Partial<Credentials>) {
	const response = await api.post("auth/sign-in", { login: credentials.login, password: credentials.password });
	return response;
}

describe("GET /user", () => {
	describe("No auth", () => {
		it("should not retrieve data from all users", async () => {
			await expectRequestFail(401, () => api.get("/user"));
		});
	});

	describe("Normal user", () => {
		it("should not retrieve data from all users", async () => {
			const { token } = (await signIn(NORMAL_CREDENTIALS)).data;
			await expectRequestFail(403, () => api.get("/user", authHeaders(token)));
		});
	});

	describe("Admin", () => {
		let usersList: object[] = [];

		it("should retrieve data from all users", async () => {
			const { token } = (await signIn(ADMIN_CREDENTIALS)).data;
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
			const { id, token } = (await signIn(NORMAL_CREDENTIALS)).data;
			await expectRequestSuccess(200, () => api.get(`/user/${id}`, authHeaders(token)));
		});

		it("should not retrieve other users data", async () => {
			const { token } = (await signIn(NORMAL_CREDENTIALS)).data;
			await expectRequestFail(403, () => api.get(`/user/${1}`, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		let userData;

		it("should retrieve its own data", async () => {
			const { id, token } = (await signIn(ADMIN_CREDENTIALS)).data;
			await expectRequestSuccess(200, () => api.get(`/user/${id}`, authHeaders(token)));
		});

		it("should retrieve other users data", async () => {
			const { token: tokenAdmin } = (await signIn(ADMIN_CREDENTIALS)).data;
			const { id: idNormal } = (await signIn(NORMAL_CREDENTIALS)).data;
			const response = await expectRequestSuccess(200, () => api.get(`/user/${idNormal}`, authHeaders(tokenAdmin)));

			userData = response?.data;
			expect(userData).not.toHaveProperty("password");
		});

		it("should not retrieve an invalid user (12345678)", async () => {
			const { token } = (await signIn(ADMIN_CREDENTIALS)).data;
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
			const { token } = (await signIn(NORMAL_CREDENTIALS)).data;
			await expectRequestFail(403, () => api.post("/user", {}, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		const login = generateNewUserData();

		it("should create user", async () => {
			const { token } = (await signIn(ADMIN_CREDENTIALS)).data;
			await expectRequestSuccess(201, () => api.post("/user", login, authHeaders(token)));
		});

		it("should not create users with repeated login", async () => {
			const { token } = (await signIn(ADMIN_CREDENTIALS)).data;
			await expectRequestFail(409, () => api.post("/user", login, authHeaders(token)));
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
		const loginOriginal = generateNewUserData();
		const loginUpdate = generateNewUserData();

		it("should update its own data", async () => {
			await UserService.create(loginOriginal);

			const { id, token } = (await signIn(loginOriginal)).data;
			await expectRequestSuccess(200, () => api.patch(`/user/${id}`, loginUpdate, authHeaders(token)));
		});

		it("should login only with new credentials", async () => {
			await expectRequestSuccess(200, () => signIn(loginUpdate));
			await expectRequestFail(400, () => signIn(loginOriginal));
		});

		it("should update its own data (reset to original)", async () => {
			const { id, token } = (await signIn(loginUpdate)).data;
			await expectRequestSuccess(200, () => api.patch(`/user/${id}`, loginOriginal, authHeaders(token)));
		});

		it("should login only with the new credentials (reseted to original)", async () => {
			await expectRequestSuccess(200, () => signIn(loginOriginal));
			await expectRequestFail(400, () => signIn(loginUpdate));
		});

		it("should not make users admin", async () => {
			const { id, token } = (await signIn(loginOriginal)).data;
			await expectRequestFail(403, () => api.patch(`/user/${id}`, { isAdmin: true }, authHeaders(token)));
		});

		it("should not update other users data", async () => {
			const { token: tokenNormal } = (await signIn(NORMAL_CREDENTIALS)).data;
			const { id: idAdmin } = (await signIn(ADMIN_CREDENTIALS)).data;
			await expectRequestFail(403, () => api.get(`/user/${idAdmin}`, authHeaders(tokenNormal)));
		});
	});

	describe("Admin", () => {
		const loginOriginal = generateNewUserData();
		const loginUpdate = generateNewUserData();

		it("should update data of other users and make admin", async () => {
			await UserService.create(loginOriginal);

			const { token: tokenAdmin } = (await signIn(ADMIN_CREDENTIALS)).data;
			const { id: idNormal } = (await signIn(loginOriginal)).data;
			await expectRequestSuccess(200, () =>
				api.patch(
					`/user/${idNormal}`,
					{
						...loginUpdate,
						isAdmin: true,
					},
					authHeaders(tokenAdmin)
				)
			);

			await expectRequestFail(400, () => signIn(loginOriginal));
			await expectRequestSuccess(200, () => signIn(loginUpdate));
		});

		it("should login only with new credentials", async () => {
			await expectRequestSuccess(200, () => signIn(loginUpdate));
			await expectRequestFail(400, () => signIn(loginOriginal));
		});

		it("should update data of other users (reset to original)", async () => {
			const { token: tokenAdmin } = (await signIn(ADMIN_CREDENTIALS)).data;
			const { id: idNormal } = (await signIn(loginUpdate)).data;
			await expectRequestSuccess(200, () =>
				api.patch(`/user/${idNormal}`, { ...loginOriginal, isAdmin: false }, authHeaders(tokenAdmin))
			);
		});

		it("should login only with the new credentials (reseted to original)", async () => {
			await expectRequestSuccess(200, () => signIn(loginOriginal));
			await expectRequestFail(400, () => signIn(loginUpdate));
		});

		it("should not update an invalid user (12345678)", async () => {
			const { token } = (await signIn(ADMIN_CREDENTIALS)).data;
			await expectRequestFail(404, () =>
				api.patch(`/user/${12345678}`, { login: generateUniqueLogin() }, authHeaders(token))
			);
		});

		it("should not update login to another existing", async () => {
			const { token: tokenAdmin } = (await signIn(ADMIN_CREDENTIALS)).data;
			const { id: idNormal } = (await signIn(NORMAL_CREDENTIALS)).data;
			await expectRequestFail(409, () =>
				api.patch(`/user/${idNormal}`, { login: ADMIN_CREDENTIALS.login }, authHeaders(tokenAdmin))
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
		const loginToNotDelete = generateNewUserData();

		it("should not be able to delete", async () => {
			await UserService.create(loginToNotDelete);
			const { id, token } = (await signIn(loginToNotDelete)).data;
			await expectRequestFail(403, () => api.delete(`/user/${id}`, authHeaders(token)));
		});
	});

	describe("Admin", () => {
		const loginToDelete = generateNewUserData();
		let idToDelete: number;

		it("should be able to delete users", async () => {
			await UserService.create(loginToDelete);

			const { token: tokenAdmin } = (await signIn(ADMIN_CREDENTIALS)).data;
			idToDelete = (await signIn(loginToDelete)).data.id;
			await expectRequestSuccess(204, () => api.delete(`/user/${idToDelete}`, authHeaders(tokenAdmin)));
		});

		it("should not delete a user more than once", async () => {
			const { token: tokenAdmin } = (await signIn(ADMIN_CREDENTIALS)).data;
			await expectRequestFail(404, () => api.delete(`/user/${idToDelete}`, authHeaders(tokenAdmin)));
		});

		it("should not delete an invalid user (12345678)", async () => {
			const { token: tokenAdmin } = (await signIn(ADMIN_CREDENTIALS)).data;
			await expectRequestFail(404, () => api.delete(`/user/${12345678}`, authHeaders(tokenAdmin)));
		});
	});
});
