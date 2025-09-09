import prisma from "../../../lib/prisma";
import { Repository } from "../../../modules/index";
import { CreateTypeData, IType, UpdateTypeData } from "./type.model";

const defaultSelectFields = {
	id: true,
	name: true,
};

const TypeRepository: Repository<IType, CreateTypeData, UpdateTypeData> & {
	getOneByName: (name: string) => Promise<IType | null>;
} = {
	async getAll() {
		return prisma.type.findMany({
			select: defaultSelectFields,
		});
	},

	async getOne(id) {
		return prisma.type.findUnique({
			where: { id },
			select: defaultSelectFields,
		});
	},

	async create(data) {
		return prisma.type.create({
			data: {
				name: data.name,
			},
			select: defaultSelectFields,
		});
	},

	async update(id, data) {
		return prisma.type.update({
			where: { id },
			data: {
				name: data.name,
			},
			select: defaultSelectFields,
		});
	},

	async delete(id) {
		return prisma.type.delete({
			where: { id },
			select: defaultSelectFields,
		});
	},

	async getOneByName(name) {
		return prisma.type.findUnique({
			where: { name },
			select: defaultSelectFields,
		});
	},
};

export default TypeRepository;
