import { Service } from "@/modules";
import { ConflictException, NotFoundException } from "@/utils/exception.utils";
import CourseService from "@/modules/course/course.service";

import ComponentRepository from "./component.repository";
import { CreateComponentData, IComponent, SetComponentsData, UpdateComponentData } from "./component.model";

const ComponentService: Service<IComponent, CreateComponentData, UpdateComponentData> & {
	getAllFromCourse: (courseId: number) => Promise<IComponent[]>;
	setAllComponents: (courseId: number, components: SetComponentsData) => Promise<IComponent[]>;
	setRequisites: (id: number, courseId: number, requisites: string[]) => Promise<void>;
} = {
	async getAll() {
		return ComponentRepository.getAll();
	},

	async getOne(id) {
		const found = await ComponentRepository.getOne(id);
		if (!found) throw new NotFoundException("Component");
		return found;
	},

	async create(data) {
		if ((await ComponentRepository.getOneByCodeInCourse(data.code, data.courseId)) != null)
			throw new ConflictException("Component code");
		return ComponentRepository.create(data);
	},

	async update(id, data) {
		await this.getOne(id);
		if (
			data.code &&
			data.courseId &&
			(await ComponentRepository.getOneByCodeInCourse(data.code, data.courseId)) != null
		)
			throw new ConflictException("Component code");
		return ComponentRepository.update(id, data);
	},

	async delete(id) {
		await this.getOne(id);

		const requisites = await ComponentRepository.getRequisites(id);
		if (requisites.length > 0) {
			throw new ConflictException("Is Requisite");
		}

		return ComponentRepository.delete(id);
	},

	async getAllFromCourse(courseId) {
		await CourseService.getOne(courseId);

		const components = await ComponentRepository.getAllFromCourse(courseId);
		return components;
	},

	async setAllComponents(courseId, data) {
		await CourseService.getOne(courseId);

		// Delete all previous components
		const previousComponents = await ComponentRepository.getAllFromCourse(courseId);
		await Promise.all(previousComponents.map((c) => this.delete(c.id)));

		// Create all new components
		const newComponents: IComponent[] = [];
		for (const c of data.components) {
			newComponents.push(await this.create({ ...c, courseId }));
		}

		// Create all requisites
		await Promise.all(data.components.map((c, i) => this.setRequisites(newComponents[i].id, courseId, c.requisites)));

		return ComponentRepository.getAllFromCourse(courseId);
	},

	async setRequisites(id, courseId, requisites) {
		// TODO: Avoid self-requisite + Validate requisite codes
		const requisiteIds = (
			await Promise.all(requisites.map((r) => ComponentRepository.getOneByCodeInCourse(r, courseId)))
		)
			.filter((r) => r != null)
			.map((r) => r.id);
		await ComponentRepository.setRequisites(id, requisiteIds);
	},
};

export default ComponentService;
