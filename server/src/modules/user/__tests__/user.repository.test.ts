import { generateNewUserData } from "@/utils/tests/tests.credentials";

import UserRepository from "../user.repository";

describe("UserRepository", () => {
	it("should create and read many users (10)", async () => {
		const usersCredentials = Array.from({ length: 10 }, () => generateNewUserData());
		await Promise.all(usersCredentials.map((credentials) => UserRepository.create({ ...credentials, isAdmin: false })));

		const users = await UserRepository.getAll();
		expect(users.length).toBeGreaterThanOrEqual(usersCredentials.length);

		usersCredentials.forEach(async (credentials) => {
			expect(users.some((user) => user.login == credentials.login)).toBe(true);
		});
	});

	it("should create and fetch a user", async () => {
		const credentials = generateNewUserData();

		const user = await UserRepository.create({ ...credentials, isAdmin: false });
		expect(user).not.toBeNull();

		const fetched = await UserRepository.getOne(user.id);
		expect(fetched).not.toBeNull();
		expect(fetched?.login).toBe(credentials.login);
	});

	it("should not fetch an invalid user (99999)", async () => {
		const user = await UserRepository.getOne(99999);
		expect(user).toBeNull();
	});

	it("should update a user data", async () => {
		const credentialsOriginal = generateNewUserData();
		const credentialsNew = generateNewUserData();

		const user = await UserRepository.create({ ...credentialsOriginal, isAdmin: false });
		expect(user).not.toBeNull();

		const updated = await UserRepository.update(user.id, { ...credentialsNew });
		expect(updated.id).toBe(user.id);

		const fetched = await UserRepository.getOne(updated.id);
		expect(fetched?.login).toBe(credentialsNew.login);
	});

	it("should delete a user and not fetch after deleted", async () => {
		const credentials = generateNewUserData();

		const user = await UserRepository.create({ ...credentials, isAdmin: false });
		expect(user).not.toBeNull();

		const deleted = await UserRepository.delete(user.id);
		expect(deleted.id).toBe(user.id);

		const fetched = await UserRepository.getOne(deleted.id);
		expect(fetched).toBeNull();
	});

	it("should fetch a user by its login", async () => {
		const credentials = generateNewUserData();

		const user = await UserRepository.create({ ...credentials, isAdmin: false });
		expect(user).not.toBeNull();

		const fetched = await UserRepository.getOneByLogin(user.login);
		expect(fetched).not.toBeNull();
		expect(fetched?.id).toBe(user.id);
		expect(fetched?.login).toBe(user.login);
	});
});
