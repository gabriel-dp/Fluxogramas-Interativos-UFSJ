import prisma from "@/lib/prisma";

import { CreateCampusData, ICampus, UpdateCampusData } from "./campus.model";

async function getAllCampuses(): Promise<ICampus[]> {
	return prisma.campus.findMany();
}

async function getCampusById(id: number): Promise<ICampus | null> {
	return prisma.campus.findUnique({ where: { id } });
}

async function createCampus(data: CreateCampusData): Promise<ICampus> {
	return prisma.campus.create({
		data: {
			name: data.name,
		},
	});
}

async function updateCampus(id: number, data: UpdateCampusData): Promise<ICampus> {
	return prisma.campus.update({
		where: { id },
		data: {
			name: data.name,
		},
	});
}

async function deleteCampus(id: number): Promise<ICampus> {
	return prisma.campus.delete({ where: { id } });
}

export default { getAllCampuses, getCampusById, createCampus, updateCampus, deleteCampus };
