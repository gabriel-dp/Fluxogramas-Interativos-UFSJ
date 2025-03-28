import prisma from "@/lib/prisma";
import { Repository } from "@/modules";

import { CreateTypeData, IType, UpdateTypeData } from "./type.model";

const defaultSelectFields = {
	id: true,
	name: true,
};

const TypeRepository: Repository<IType, CreateTypeData, UpdateTypeData> & {
	getOneByName: (name: string) => Promise<IType | null>;
} = {
	async getAll() {
		return prisma.campus.findMany({
			select: defaultSelectFields,
		});
	},

	async getOne(id) {
		return prisma.campus.findUnique({
			where: { id },
			select: defaultSelectFields,
		});
	},

	async create(data) {
		return prisma.campus.create({
			data: {
				name: data.name,
			},
			select: defaultSelectFields,
		});
	},

	async update(id, data) {
		return prisma.campus.update({
			where: { id },
			data: {
				name: data.name,
			},
			select: defaultSelectFields,
		});
	},

	async delete(id) {
		return prisma.campus.delete({
			where: { id },
			select: defaultSelectFields,
		});
	},

	async getOneByName(name) {
		return prisma.campus.findUnique({
			where: { name },
			select: defaultSelectFields,
		});
	},
};

export default TypeRepository;
