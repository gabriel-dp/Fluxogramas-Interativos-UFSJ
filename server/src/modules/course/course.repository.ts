import { ComponentRequisite } from "@prisma/client";

import { Repository } from "@/modules";
import prisma from "@/lib/prisma";

import { IComponent } from "@/modules/component/component.model";
import { CreateCourseData, ICourseComplete, ICourseComponents, UpdateCourseData } from "./course.model";

const defaultSelectFields = {
	id: true,
	code: true,
	name: true,
	type: {
		select: {
			id: true,
			name: true,
		},
	},
	shift: {
		select: {
			id: true,
			name: true,
		},
	},
	campus: {
		select: {
			id: true,
			name: true,
		},
	},
};

function mapComponentRequisites(
	component: Omit<IComponent, "requisites"> & { requisites: ComponentRequisite[] },
): IComponent {
	return {
		...component,
		requisites: component.requisites.map((r) => ({ id: r.requisiteId, corequisite: r.type === "COREQUISITE" })),
	};
}

const CourseRepository: Repository<ICourseComplete, CreateCourseData, UpdateCourseData> & {
	getOneByCode: (code: string) => Promise<ICourseComplete | null>;
} = {
	async getAll() {
		return prisma.course.findMany({
			select: defaultSelectFields,
		});
	},

	async getOne(id): Promise<ICourseComponents | null> {
		const course = await prisma.course.findUnique({
			where: { id },
			select: {
				...defaultSelectFields,
				Component: {
					include: {
						requisites: true,
					},
				},
			},
		});
		if (!course) return null;

		// fix Component property
		const { Component, ...data } = course;
		const components = Component.map((c) => mapComponentRequisites(c));

		return { ...data, components };
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
		const found = await prisma.course.findUnique({
			where: { code },
			select: { id: true },
		});
		if (!found) return null;
		return this.getOne(found.id);
	},
};

export default CourseRepository;
