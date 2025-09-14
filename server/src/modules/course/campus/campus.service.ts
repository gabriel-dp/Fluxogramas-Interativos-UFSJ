import { Service } from "../../../modules/index";
import { ConflictException, NotFoundException } from "../../../utils/exception.utils";
import { CreateCampusData, ICampus, UpdateCampusData } from "./campus.model";
import CampusRepository from "./campus.repository";

const CampusService: Service<ICampus, CreateCampusData, UpdateCampusData> = {
	async getAll() {
		return CampusRepository.getAll();
	},

	async getOne(id) {
		const found = await CampusRepository.getOne(id);
		if (!found) throw new NotFoundException("Campus");
		return found;
	},

	async create(data) {
		if ((await CampusRepository.getOneByName(data.name)) != null) throw new ConflictException("Campus name");
		return CampusRepository.create(data);
	},

	async update(id, data) {
		await this.getOne(id);
		if (data.name) {
			const sameName = await CampusRepository.getOneByName(data.name);
			if (sameName && sameName.id != id) throw new ConflictException("Campus name");
		}
		return CampusRepository.update(id, data);
	},

	async delete(id) {
		await this.getOne(id);
		if (await CampusRepository.hasUsage(id)) throw new ConflictException("Campus course");
		return CampusRepository.delete(id);
	},
};

export default CampusService;
