import { Service } from "../../modules/index";
import { ConflictException, NotFoundException } from "../../utils/exception.utils";
import PermissionUserCourseService from "../../modules/permission_user_course/permission_user_course.service";
import ComponentService from "../component/component.service";
import { CreateCourseData, ICourseComplete, UpdateCourseData } from "./course.model";
import CourseRepository from "./course.repository";

const CourseService: Service<ICourseComplete, CreateCourseData, UpdateCourseData> & {
	getOneByCode: (code: string) => Promise<ICourseComplete>;
} = {
	async getAll() {
		return CourseRepository.getAll();
	},

	async getOne(id) {
		const found = await CourseRepository.getOne(id);
		if (!found) throw new NotFoundException("Course");
		return found;
	},

	async create(data) {
		if ((await CourseRepository.getOneByCode(data.code)) != null) throw new ConflictException("Course code");
		return CourseRepository.create(data);
	},

	async update(id, data) {
		await this.getOne(id);
		if (data.code) {
			const sameCode = await CourseRepository.getOneByCode(data.code);
			if (sameCode && sameCode.id != id) throw new ConflictException("Course code");
		}
		return CourseRepository.update(id, data);
	},

	async delete(id) {
		await this.getOne(id);

		// Delete Permissions
		await PermissionUserCourseService.removeCoursePermissions(id);

		// Delete Components
		const components = await ComponentService.getAllFromCourse(id);
		await Promise.all(
			components.map(async (c) => {
				await ComponentService.setRequisites(c.id, []);
				await ComponentService.delete(c.id);
			}),
		);

		return CourseRepository.delete(id);
	},

	async getOneByCode(code) {
		const found = await CourseRepository.getOneByCode(code);
		if (!found) throw new NotFoundException("Course");
		return found;
	},
};

export default CourseService;
