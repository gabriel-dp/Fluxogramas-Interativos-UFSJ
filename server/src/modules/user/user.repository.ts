import prisma from "@/lib/prisma";

import { Repository } from "@/modules";

import { CreateUserData, IUser, UpdateUserData } from "./user.model";

const UserRepository: Repository<IUser, CreateUserData, UpdateUserData> & {
	loginExists: (login: string) => Promise<boolean>;
	anyAdminExists: () => Promise<boolean>;
} = {
	async getAll() {
		return prisma.user.findMany({
			select: {
				id: true,
				login: true,
				isAdmin: true,
			},
		});
	},

	async getOne(id: number) {
		return prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				login: true,
				isAdmin: true,
			},
		});
	},

	async create(data: CreateUserData) {
		return prisma.user.create({
			data: {
				login: data.login,
				password: data.password,
				isAdmin: data.isAdmin,
			},
			select: {
				id: true,
				login: true,
				isAdmin: true,
			},
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
			select: {
				id: true,
				login: true,
				isAdmin: true,
			},
		});
	},

	async delete(id: number) {
		return prisma.user.delete({
			where: { id },
			select: {
				id: true,
				login: true,
				isAdmin: true,
			},
		});
	},

	async loginExists(login: string) {
		return prisma.user.findUnique({ where: { login } }).then((user) => user != null);
	},

	async anyAdminExists() {
		return prisma.user.findFirst({ where: { isAdmin: true } }).then((admin) => admin != null);
	},
};

export default UserRepository;
