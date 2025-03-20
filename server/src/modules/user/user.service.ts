import { Service } from "@/modules";
import { encryptPassword } from "@/utils/auth.utils";
import { ConflictException, NotFoundException } from "@/utils/exception.utils";

import UserRepository from "./user.repository";
import { CreateUserData, IUser, UpdateUserData } from "./user.model";

const UserService: Service<IUser, CreateUserData, UpdateUserData> & {
	ensureUniqueLogin: (login: string) => Promise<void>;
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
		await this.ensureUniqueLogin(data.login);
		data.password = await encryptPassword(data.password);
		return UserRepository.create(data);
	},

	async update(id, data) {
		const user = await this.getOne(id);
		if (data.login && data.login != user.login) {
			await this.ensureUniqueLogin(data.login);
		}
		if (data.password) {
			data.password = await encryptPassword(data.password);
		}
		return UserRepository.update(id, data);
	},

	async delete(id) {
		await this.getOne(id);
		return UserRepository.delete(id);
	},

	async ensureUniqueLogin(login: string) {
		if (await UserRepository.loginExists(login)) {
			throw new ConflictException("User login conflict");
		}
	},

	async registerFirstAdminIfNotExists(data) {
		if (await UserRepository.anyAdminExists()) return;
		return this.create(data);
	},
};

export default UserService;
