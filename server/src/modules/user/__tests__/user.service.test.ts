import { generateNewUserData } from "@/utils/tests/tests.credentials";

import UserService from "../user.service";

describe("UserService", () => {
	it("should create and read many users (10)", async () => {
		const usersCredentials = Array.from({ length: 10 }, () => generateNewUserData());
		await Promise.all(usersCredentials.map((credentials) => UserService.create({ ...credentials, isAdmin: false })));

		const users = await UserService.getAll();
		expect(users.length).toBeGreaterThanOrEqual(usersCredentials.length);

		usersCredentials.forEach(async (credentials) => {
			expect(users.some((user) => user.login == credentials.login)).toBe(true);
		});
	});

	it("should create and fetch a user", async () => {
		const credentials = generateNewUserData();

		const user = await UserService.create({ ...credentials, isAdmin: false });
		expect(user).not.toBeNull();

		const fetched = await UserService.getOne(user.id);
		expect(fetched.id).toBe(user.id);
	});

	it("should not fetch an invalid user (99999)", async () => {
		await expect(UserService.getOne(999)).rejects.toThrow();
	});

	it("should update a user data", async () => {
		const credentialsOriginal = generateNewUserData();
		const credentialsNew = generateNewUserData();

		const user = await UserService.create({ ...credentialsOriginal, isAdmin: false });
		expect(user).not.toBeNull();

		const updated = await UserService.update(user.id, { ...credentialsNew });
		expect(updated.id).toBe(user.id);

		const fetched = await UserService.getOne(updated.id);
		expect(fetched.login).toBe(credentialsNew.login);
	});

	it("should delete a user and not fetch after deleted", async () => {
		const credentials = generateNewUserData();

		const user = await UserService.create({ ...credentials, isAdmin: false });
		expect(user).not.toBeNull();

		const deleted = await UserService.delete(user.id);
		expect(deleted.id).toBe(user.id);

		await expect(UserService.getOne(deleted.id)).rejects.toThrow();
	});

	it("should encript user password when creating", async () => {
		const credentials = generateNewUserData();
		const user = await UserService.create({ ...credentials, isAdmin: false });
		expect(user.password).not.toBe(credentials.password);
	});

	it("should not create users with same login", async () => {
		const credentials1 = generateNewUserData();
		const credentials2 = generateNewUserData();

		const user = await UserService.create({ ...credentials1, isAdmin: false });
		await expect(UserService.create({ ...credentials2, login: user.login, isAdmin: false })).rejects.toThrow();
	});

	it("should not update user login to an existing one", async () => {
		const credentials1 = generateNewUserData();
		const credentials2 = generateNewUserData();

		await UserService.create({ ...credentials1, isAdmin: false });
		const user = await UserService.create({ ...credentials2, isAdmin: false });

		await expect(UserService.update(user.id, credentials1)).rejects.toThrow();
	});
});
