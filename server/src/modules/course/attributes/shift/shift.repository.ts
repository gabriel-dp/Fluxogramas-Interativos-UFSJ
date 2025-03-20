import prisma from "@/lib/prisma";

import { CreateShiftData, IShift, UpdateShiftData } from "./shift.model";

async function getAllShifts(): Promise<IShift[]> {
	return prisma.shift.findMany();
}

async function getShiftById(id: number): Promise<IShift | null> {
	return prisma.shift.findUnique({ where: { id } });
}

async function createShift(data: CreateShiftData): Promise<IShift> {
	return prisma.shift.create({
		data: {
			name: data.name,
		},
	});
}

async function updateShift(id: number, data: UpdateShiftData): Promise<IShift> {
	return prisma.shift.update({
		where: { id },
		data: {
			name: data.name,
		},
	});
}

async function deleteShift(id: number): Promise<IShift> {
	return prisma.shift.delete({ where: { id } });
}

export default { getAllShifts, getShiftById, createShift, updateShift, deleteShift };
