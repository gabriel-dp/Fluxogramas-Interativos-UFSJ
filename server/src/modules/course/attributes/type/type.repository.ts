import prisma from "@/lib/prisma";

import { CreateTypeData, IType, UpdateTypeData } from "./type.model";

async function getAllTypes(): Promise<IType[]> {
	return prisma.type.findMany();
}

async function getTypeById(id: number): Promise<IType | null> {
	return prisma.type.findUnique({ where: { id } });
}

async function createType(data: CreateTypeData): Promise<IType> {
	return prisma.type.create({
		data: {
			name: data.name,
		},
	});
}

async function updateType(id: number, data: UpdateTypeData): Promise<IType> {
	return prisma.type.update({
		where: { id },
		data: {
			name: data.name,
		},
	});
}

async function deleteType(id: number): Promise<IType> {
	return prisma.type.delete({ where: { id } });
}

export default { getAllTypes, getTypeById, createType, updateType, deleteType };
