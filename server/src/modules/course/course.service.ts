import { NotFoundException } from "@/utils/exception.utils";
import { Service } from "..";
import { CreateCourseData, ICourse, UpdateCourseData } from "./course.model";
import CourseRepository from "./course.repository";

const CourseService: Service<ICourse, CreateCourseData, UpdateCourseData> = {
	async getAll() {
		return CourseRepository.getAll();
	},

	async getOne(id) {
		const found = await CourseRepository.getOne(id);
		if (!found) throw new NotFoundException("User");
		return found;
	},

	async create(data) {
		return CourseRepository.create(data);
	},

	async update(id, data) {
		await this.getOne(id);
		return CourseRepository.update(id, data);
	},

	async delete(id) {
		await this.getOne(id);
		return CourseRepository.delete(id);
	},
};

export default CourseService;
