import { api, expectFail, expectSuccess, signInToken } from "./utils.tests";
import { ADMIN_CREDENTIALS } from "./consts.tests";

describe("POST /auth/register", () => {
	describe("Without auth", () => {
		it("should register an user providing login and password", async () => {
			await expectSuccess(201, () =>
				api.post("/auth/register", {
					login: "login1login",
					password: "12345678",
				})
			);
		});

		it("should not register user with repeated login", async () => {
			await expectFail(400, () =>
				api.post("/auth/register", {
					login: "login1login",
					password: "12345678",
				})
			);
		});

		it("should not register user with login with less than 4 chars", async () => {
			await expectFail(400, () =>
				api.post("/auth/register", {
					login: "abc",
					password: "12345678",
				})
			);
		});

		it("should not register user with password with less than 8 chars", async () => {
			await expectFail(400, () =>
				api.post("/auth/register", {
					login: "login2login",
					password: "1234567",
				})
			);
		});

		it("should not register admin user without admin privileges", async () => {
			await expectFail(401, () =>
				api.post("/auth/register", {
					login: "login3login",
					password: "12345678",
					isAdmin: true,
				})
			);
		});

		it("should not register user without password", async () => {
			await expectFail(400, () =>
				api.post("/auth/register", {
					login: "login4login",
				})
			);
		});

		it("should not register user without login", async () => {
			await expectFail(400, () =>
				api.post("/auth/register", {
					password: "12345678",
				})
			);
		});
	});

	describe("With admin privileges", () => {
		it("should register an admin user", async () => {
			const token = await signInToken(ADMIN_CREDENTIALS);

			await expectSuccess(201, () =>
				api.post(
					"auth/register",
					{
						login: "gabriel-dp",
						password: "12345678",
					},
					{
						headers: {
							authorization: `Bearer ${token}`,
						},
					}
				)
			);
		});
	});
});
