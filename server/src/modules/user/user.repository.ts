import prisma from "@/lib/prisma";

import { Repository } from "@/modules";

import { CreateUserData, IUser, UpdateUserData } from "./user.model";

const defaultSelectFields = {
	id: true,
	login: true,
	isAdmin: true,
};

const UserRepository: Repository<IUser, CreateUserData, UpdateUserData> & {
	getOneByLogin: (login: string) => Promise<IUser | null>;
	anyAdminExists: () => Promise<boolean>;
} = {
	async getAll() {
		return prisma.user.findMany({
			select: defaultSelectFields,
		});
	},

	async getOne(id: number) {
		return prisma.user.findUnique({
			where: { id },
			select: defaultSelectFields,
		});
	},

	async create(data: CreateUserData) {
		return prisma.user.create({
			data: {
				login: data.login,
				password: data.password,
				isAdmin: data.isAdmin,
			},
			select: defaultSelectFields,
		});
	},

	async update(id: number, data: UpdateUserData) {
		return prisma.user.update({
			where: { id },
			data: {
				login: data.login,
				password: data.password,
				isAdmin: data.isAdmin,
			},
			select: defaultSelectFields,
		});
	},

	async delete(id: number) {
		return prisma.user.delete({
			where: { id },
			select: defaultSelectFields,
		});
	},

	async getOneByLogin(login: string) {
		return prisma.user.findUnique({
			where: { login },
			select: { ...defaultSelectFields, password: true },
		});
	},

	async anyAdminExists() {
		return prisma.user.findFirst({ where: { isAdmin: true } }).then((admin) => admin != null);
	},
};

export default UserRepository;
