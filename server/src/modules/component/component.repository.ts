import { ComponentRequisite, RequisiteType } from "@prisma/client";

import prisma from "#src/lib/prisma";
import { Repository } from "#src/modules/index";

import { CreateComponentData, IComponent, Requisite, UpdateComponentData } from "./component.model";

const defaultSelectFields = {
	id: true,
	code: true,
	name: true,
	hours: true,
	type: true,
	semester: true,
	courseId: true,
	requisites: true,
};

function mapComponentRequisites(
	component: Omit<IComponent, "requisites"> & { requisites: ComponentRequisite[] },
): IComponent {
	return {
		...component,
		requisites: component.requisites.map((r) => ({
			id: r.requisiteId,
			corequisite: r.type === RequisiteType.COREQUISITE,
		})),
	};
}

const ComponentRepository: Repository<IComponent, CreateComponentData, UpdateComponentData> & {
	getOneByCodeInCourse: (code: string, courseId: number) => Promise<IComponent | null>;
	getAllFromCourse: (courseId: number) => Promise<IComponent[]>;
	getRequisites: (id: number) => Promise<number[]>;
	setRequisites: (id: number, requisites: Requisite[]) => Promise<void>;
} = {
	async getAll() {
		const components = await prisma.component.findMany({
			select: defaultSelectFields,
		});
		return components.map((c) => mapComponentRequisites(c));
	},

	async getOne(id) {
		const component = await prisma.component.findUnique({
			where: { id },
			select: defaultSelectFields,
		});
		if (!component) return null;
		return mapComponentRequisites(component);
	},

	async create(data) {
		const component = await prisma.component.create({
			data,
			select: defaultSelectFields,
		});
		return mapComponentRequisites(component);
	},

	async update(id, data) {
		const component = await prisma.component.update({
			data,
			where: { id },
			select: defaultSelectFields,
		});
		return mapComponentRequisites(component);
	},

	async delete(id) {
		// Delete all requisites
		await this.setRequisites(id, []);

		const component = await prisma.component.delete({
			where: { id },
			select: defaultSelectFields,
		});
		return mapComponentRequisites(component);
	},

	async getOneByCodeInCourse(code, courseId) {
		const component = await prisma.component.findUnique({
			where: { courseId_code: { code, courseId } },
			select: defaultSelectFields,
		});
		if (!component) return null;
		return mapComponentRequisites(component);
	},

	async getAllFromCourse(courseId) {
		const components = await prisma.component.findMany({
			where: { courseId },
			select: defaultSelectFields,
		});
		return components.map((c) => mapComponentRequisites(c));
	},

	async getRequisites(id) {
		const requisites = await prisma.componentRequisite.findMany({
			where: { componentId: id },
			select: { requisiteId: true },
		});
		return requisites.map((r) => r.requisiteId);
	},

	async setRequisites(id, requisites) {
		// Delete all requisites
		await prisma.componentRequisite.deleteMany({
			where: { componentId: id },
		});

		// Create requisites
		if (requisites.length > 0) {
			await prisma.componentRequisite.createMany({
				data: requisites.map((r) => ({
					componentId: id,
					requisiteId: r.id,
					type: r.corequisite ? RequisiteType.COREQUISITE : RequisiteType.PREREQUISITE,
				})),
			});
		}
	},
};

export default ComponentRepository;
