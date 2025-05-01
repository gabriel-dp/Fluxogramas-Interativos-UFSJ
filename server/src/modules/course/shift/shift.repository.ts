import prisma from "@/lib/prisma";
import { Repository } from "@/modules";

import { CreateShiftData, IShift, UpdateShiftData } from "./shift.model";

const defaultSelectFields = {
	id: true,
	name: true,
};

const ShiftRepository: Repository<IShift, CreateShiftData, UpdateShiftData> & {
	getOneByName: (name: string) => Promise<IShift | null>;
} = {
	async getAll() {
		return prisma.shift.findMany({
			select: defaultSelectFields,
		});
	},

	async getOne(id) {
		return prisma.shift.findUnique({
			where: { id },
			select: defaultSelectFields,
		});
	},

	async create(data) {
		return prisma.shift.create({
			data: {
				name: data.name,
			},
			select: defaultSelectFields,
		});
	},

	async update(id, data) {
		return prisma.shift.update({
			where: { id },
			data: {
				name: data.name,
			},
			select: defaultSelectFields,
		});
	},

	async delete(id) {
		return prisma.shift.delete({
			where: { id },
			select: defaultSelectFields,
		});
	},

	async getOneByName(name) {
		return prisma.shift.findUnique({
			where: { name },
			select: defaultSelectFields,
		});
	},
};

export default ShiftRepository;
