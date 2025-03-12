import { expectFail, expectSuccess } from "./utils.tests";
import { ADMIN_CREDENTIALS, NORMAL_CREDENTIALS } from "./consts.tests";
import {
	generateNewUserData,
	generateString,
	generateUniqueLogin,
	generateValidPassword,
	register,
	signIn,
} from "./auth.tests";

describe("POST /auth/register", () => {
	const repeatLogin = generateUniqueLogin().toLowerCase();

	it("should register user providing login and password", async () => {
		const response = await expectSuccess(201, () =>
			register({
				login: repeatLogin,
				password: generateValidPassword(),
			})
		);
		expect(response?.data).toHaveProperty("id");
		expect(response?.data.login).toBe(repeatLogin);
	});

	it("should register another user with uppercase repeated login", async () => {
		const response = await expectSuccess(201, () =>
			register({
				login: repeatLogin.toUpperCase(),
				password: generateValidPassword(),
			})
		);
		expect(response?.data).toHaveProperty("id");
		expect(response?.data.login).toBe(repeatLogin.toUpperCase());
	});

	it("should not register user with repeated login", async () => {
		await expectFail(409, () =>
			register({
				login: repeatLogin,
				password: generateValidPassword(),
			})
		);
	});

	it("should not register user with repeated login", async () => {
		await expectFail(409, () =>
			register({
				login: repeatLogin,
				password: generateValidPassword(),
			})
		);
	});

	it("should not register user with login with less than 4 chars", async () => {
		await expectFail(400, () =>
			register({
				login: generateString(3),
				password: generateValidPassword(),
			})
		);
	});

	it("should not register user with login with more than 64 chars", async () => {
		await expectFail(400, () =>
			register({
				login: generateString(65),
				password: generateValidPassword(),
			})
		);
	});

	it("should not register user with password with less than 8 chars", async () => {
		await expectFail(400, () =>
			register({
				login: generateUniqueLogin(),
				password: generateString(7),
			})
		);
	});

	it("should not register user with password with more than 64 chars", async () => {
		await expectFail(400, () =>
			register({
				login: generateUniqueLogin(),
				password: generateString(65),
			})
		);
	});

	it("should not register user with a blank login", async () => {
		await expectFail(400, () =>
			register({
				login: generateString(10, " "),
				password: generateValidPassword(),
			})
		);
	});

	it("should not register user without password", async () => {
		await expectFail(400, () =>
			register({
				login: generateUniqueLogin(),
			})
		);
	});

	it("should not register user without login", async () => {
		await expectFail(400, () =>
			register({
				password: generateValidPassword(),
			})
		);
	});

	it("should not register admin user", async () => {
		await expectFail(401, () =>
			register({
				login: generateUniqueLogin(),
				password: generateValidPassword(),
				isAdmin: true,
			})
		);
	});

	describe("Normal user", () => {
		it("should be able to register a user", async () => {
			const { token } = (await signIn(NORMAL_CREDENTIALS)).data;
			await expectSuccess(201, () => register(generateNewUserData(), token));
		});
	});

	describe("Admin", () => {
		it("should register an admin user", async () => {
			const { token } = (await signIn(ADMIN_CREDENTIALS)).data;
			const response = await expectSuccess(201, () =>
				register(
					{
						...generateNewUserData(),
						isAdmin: true,
					},
					token
				)
			);
			expect(response?.data).toHaveProperty("id");
			expect(response?.data.isAdmin).toBe(true);
		});
	});
});

describe("POST /auth/sign-in", () => {
	it("should login user using its credentials", async () => {
		const credentials = {
			login: generateUniqueLogin(),
			password: generateString(10, "0"),
		};
		await register(credentials);
		const response = await expectSuccess(200, () => signIn(credentials));
		expect(response?.data).toHaveProperty("token");
	});

	it("should not login user using wrong password", async () => {
		const credentials = {
			login: generateUniqueLogin(),
			password: generateString(10, "0"),
		};
		await register(credentials);
		await expectFail(400, () =>
			signIn({
				login: credentials.login,
				password: generateString(10, "1"),
			})
		);
	});

	it("should not login user using wrong login", async () => {
		const credentials = {
			login: generateUniqueLogin(),
			password: generateString(10, "0"),
		};
		await register(credentials);
		await expectFail(400, () =>
			signIn({
				login: generateUniqueLogin(),
				password: credentials.password,
			})
		);
	});
});
