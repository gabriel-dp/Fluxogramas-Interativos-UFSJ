import { BadRequestException, ConflictException, NotFoundException } from "@/utils/exception.utils";
import { Service } from "@/modules";
import CourseService from "@/modules/course/course.service";
import PermissionUserCourseService from "@/modules/permission_user_course/permission_user_course.service";

import ComponentRepository from "./component.repository";
import { CreateComponentData, IComponent, Requisite, UpdateComponentData } from "./component.model";

const ComponentService: Service<IComponent, CreateComponentData, UpdateComponentData> & {
	getAllFromCourse: (courseId: number) => Promise<IComponent[]>;
	setRequisites: (id: number, requisites: Requisite[]) => Promise<IComponent>;
	isUserAllowed: (userId: number, componentId: number) => Promise<boolean>;
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
			(await ComponentRepository.getOneByCodeInCourse(data.code, data.courseId))?.id != id
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

	async setRequisites(id, requisites) {
		// Validate self-requisite and if requisite exists
		await Promise.all(
			requisites.map((r) => {
				if (r.id === id) throw new BadRequestException("Self requisite is not allowed");
				return this.getOne(r.id);
			}),
		);

		await ComponentRepository.setRequisites(id, requisites);

		return this.getOne(id);
	},

	async isUserAllowed(userId, componentId) {
		const component = await this.getOne(componentId);
		return PermissionUserCourseService.isUserAllowed(userId, component.courseId);
	},
};

export default ComponentService;
