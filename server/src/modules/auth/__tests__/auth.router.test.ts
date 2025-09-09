import { api, expectRequestFail, expectRequestSuccess } from "#src/utils/tests/tests.requests";
import {
	Credentials,
	generateString,
	generateUniqueUsername,
	generateValidPassword,
} from "#src/utils/tests/tests.credentials";

async function register(credentials: Partial<Credentials>) {
	const response = await api.post("auth/register", credentials);
	return response;
}

async function signIn(credentials: Partial<Credentials>) {
	const response = await api.post("auth/sign-in", credentials);
	return response;
}

describe("POST /auth/register", () => {
	const repeatUsername = generateUniqueUsername().toLowerCase();

	it("should register user providing username and password", async () => {
		const response = await expectRequestSuccess(201, () =>
			register({
				username: repeatUsername,
				password: generateValidPassword(),
				isAdmin: false,
			}),
		);
		expect(response?.data).toHaveProperty("id");
		expect(response?.data.username).toBe(repeatUsername);
	});

	it("should register another user with uppercase repeated username", async () => {
		const response = await expectRequestSuccess(201, () =>
			register({
				username: repeatUsername.toUpperCase(),
				password: generateValidPassword(),
			}),
		);
		expect(response?.data).toHaveProperty("id");
		expect(response?.data.username).toBe(repeatUsername.toUpperCase());
	});

	it("should not register user with repeated username", async () => {
		await expectRequestFail(409, () =>
			register({
				username: repeatUsername,
				password: generateValidPassword(),
			}),
		);
	});

	it("should not register user with repeated username", async () => {
		await expectRequestFail(409, () =>
			register({
				username: repeatUsername,
				password: generateValidPassword(),
			}),
		);
	});

	it("should not register user with username with less than 4 chars", async () => {
		await expectRequestFail(400, () =>
			register({
				username: generateString(3),
				password: generateValidPassword(),
			}),
		);
	});

	it("should not register user with username with more than 64 chars", async () => {
		await expectRequestFail(400, () =>
			register({
				username: generateString(65),
				password: generateValidPassword(),
			}),
		);
	});

	it("should not register user with password with less than 8 chars", async () => {
		await expectRequestFail(400, () =>
			register({
				username: generateUniqueUsername(),
				password: generateString(7),
			}),
		);
	});

	it("should not register user with password with more than 64 chars", async () => {
		await expectRequestFail(400, () =>
			register({
				username: generateUniqueUsername(),
				password: generateString(65),
			}),
		);
	});

	it("should not register user with a blank username", async () => {
		await expectRequestFail(400, () =>
			register({
				username: generateString(10, " "),
				password: generateValidPassword(),
			}),
		);
	});

	it("should not register user without password", async () => {
		await expectRequestFail(400, () =>
			register({
				username: generateUniqueUsername(),
			}),
		);
	});

	it("should not register user without username", async () => {
		await expectRequestFail(400, () =>
			register({
				password: generateValidPassword(),
			}),
		);
	});

	it("should not register admin user", async () => {
		const response = await expectRequestSuccess(201, () =>
			register({
				username: generateUniqueUsername(),
				password: generateValidPassword(),
				isAdmin: true,
			}),
		);
		expect(response?.data).toHaveProperty("isAdmin");
		expect(response?.data.isAdmin).toBe(false);
	});
});

describe("POST /auth/sign-in", () => {
	it("should username user using its credentials", async () => {
		const credentials = {
			username: generateUniqueUsername(),
			password: generateString(10, "0"),
		};
		await register(credentials);
		const response = await expectRequestSuccess(200, () => signIn(credentials));
		expect(response?.data).toHaveProperty("token");
	});

	it("should not username user using wrong password", async () => {
		const credentials = {
			username: generateUniqueUsername(),
			password: generateString(10, "1"),
		};
		await register(credentials);
		await expectRequestFail(400, () =>
			signIn({
				username: credentials.username,
				password: generateString(10, "2"),
			}),
		);
	});

	it("should not username user using wrong username", async () => {
		const credentials = {
			username: generateUniqueUsername(),
			password: generateString(10, "0"),
		};
		await register(credentials);
		await expectRequestFail(400, () =>
			signIn({
				username: generateUniqueUsername(),
				password: credentials.password,
			}),
		);
	});
});
