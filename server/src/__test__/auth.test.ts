import { api, expectFail, expectSuccesss } from "./test.utils";

describe("POST /auth/register", () => {
	describe("Without admin privileges", () => {
		it("should register an user providing login and password", async () => {
			await expectSuccesss(201, () =>
				api.post("/auth/register", {
					login: "loginlogin",
					password: "12345678",
				})
			);
		});

		it("should not register user with repeated login", async () => {
			await expectFail(400, () =>
				api.post("/auth/register", {
					login: "loginlogin",
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
			await expectFail(403, () =>
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
		let token: string | undefined = undefined;

		it("should login as admin", async () => {
			await expectSuccesss(200, async () => {
				const response = await api.post("auth/sign-in", {
					login: "administrator",
					password: "@admin123",
				});

				token = response.data.token;
				if (!token) fail("should retrieve token");

				return response;
			});
		});

		it("should register an admin user", async () => {
			await expectSuccesss(201, () =>
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
