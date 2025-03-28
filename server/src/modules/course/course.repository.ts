import { Repository } from "@/modules";
import prisma from "@/lib/prisma";

import { CreateCourseData, ICourse, ICourseComplete, UpdateCourseData } from "./course.model";

const defaultSelectFields = {
	id: true,
	code: true,
	name: true,
	typeId: true,
	type: {
		select: {
			name: true,
		},
	},
	shiftId: true,
	shift: {
		select: {
			name: true,
		},
	},
	campusId: true,
	campus: {
		select: {
			name: true,
		},
	},
};

const CourseRepository: Repository<ICourse | ICourseComplete, CreateCourseData, UpdateCourseData> & {
	getOneByCode: (code: string) => Promise<ICourse | null>;
} = {
	async getAll() {
		return prisma.course.findMany({
			select: defaultSelectFields,
		});
	},

	async getOne(id) {
		return prisma.course.findUnique({
			where: { id },
			select: {
				...defaultSelectFields,
				Component: true,
			},
		});
	},

	async create(data) {
		return prisma.course.create({
			data: {
				code: data.code,
				name: data.name,
				type: { connect: { id: data.typeId } },
				shift: { connect: { id: data.shiftId } },
				campus: { connect: { id: data.campusId } },
			},
			select: defaultSelectFields,
		});
	},

	async update(id, data) {
		return prisma.course.update({
			where: { id },
			data: {
				code: data.code,
				name: data.name,
				type: { connect: { id: data.typeId } },
				shift: { connect: { id: data.shiftId } },
				campus: { connect: { id: data.campusId } },
			},
			select: defaultSelectFields,
		});
	},

	async delete(id) {
		return prisma.course.delete({
			where: { id },
			select: defaultSelectFields,
		});
	},

	async getOneByCode(code: string) {
		return prisma.course.findUnique({
			where: { code },
			select: defaultSelectFields,
		});
	},
};

export default CourseRepository;
