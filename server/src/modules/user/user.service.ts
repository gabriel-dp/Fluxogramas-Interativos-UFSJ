import { Service } from "@/modules";
import { encryptPassword } from "@/utils/auth.utils";
import { ConflictException, NotFoundException } from "@/utils/exception.utils";

import UserRepository from "./user.repository";
import { CreateUserData, IUser, UpdateUserData } from "./user.model";

const UserService: Service<IUser, CreateUserData, UpdateUserData> & {
	registerFirstAdminIfNotExists: (data: CreateUserData) => Promise<IUser | undefined>;
} = {
	async getAll() {
		return UserRepository.getAll();
	},

	async getOne(id) {
		const found = await UserRepository.getOne(id);
		if (!found) throw new NotFoundException("User");
		return found;
	},

	async create(data) {
		if ((await UserRepository.getOneByLogin(data.login)) != null) throw new ConflictException("User login");
		const newData = {
			...data,
			password: await encryptPassword(data.password),
		};
		return UserRepository.create(newData);
	},

	async update(id, data) {
		await this.getOne(id);
		if (data.login) {
			const sameLogin = await UserRepository.getOneByLogin(data.login);
			if (sameLogin && sameLogin.id != id) throw new ConflictException("User login");
		}
		const newData = {
			...data,
			password: data.password ? await encryptPassword(data.password) : undefined,
		};
		return UserRepository.update(id, newData);
	},

	async delete(id) {
		await this.getOne(id);
		return UserRepository.delete(id);
	},

	async registerFirstAdminIfNotExists(data) {
		if (await UserRepository.anyAdminExists()) return;
		return this.create(data);
	},
};

export default UserService;
