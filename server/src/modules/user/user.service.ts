import { Service } from "#src/modules/index";
import { encryptPassword } from "#src/utils/auth.utils";
import { ConflictException, NotFoundException } from "#src/utils/exception.utils";
import PermissionUserCourseService from "#src/modules/permission_user_course/permission_user_course.service";

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
		if ((await UserRepository.getOneByUsername(data.username)) != null) throw new ConflictException("User username");
		const newData = {
			...data,
			password: await encryptPassword(data.password),
		};
		return UserRepository.create(newData);
	},

	async update(id, data) {
		await this.getOne(id);
		if (data.username) {
			const sameUsername = await UserRepository.getOneByUsername(data.username);
			if (sameUsername && sameUsername.id != id) throw new ConflictException("User username");
		}
		const newData = {
			...data,
			password: data.password ? await encryptPassword(data.password) : undefined,
		};
		return UserRepository.update(id, newData);
	},

	async delete(id) {
		await this.getOne(id);
		await PermissionUserCourseService.setUserPermissions({ userId: id, courseIds: [] }); // Clear permissions
		return UserRepository.delete(id);
	},

	async registerFirstAdminIfNotExists(data) {
		if (await UserRepository.anyAdminExists()) return;
		return this.create(data);
	},
};

export default UserService;
