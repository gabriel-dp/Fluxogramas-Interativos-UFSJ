import { Service } from "#src/modules/index";
import { ConflictException, NotFoundException } from "#src/utils/exception.utils";

import { CreateTypeData, IType, UpdateTypeData } from "./type.model";
import TypeRepository from "./type.repository";

const TypeService: Service<IType, CreateTypeData, UpdateTypeData> = {
	async getAll() {
		return TypeRepository.getAll();
	},

	async getOne(id) {
		const found = await TypeRepository.getOne(id);
		if (!found) throw new NotFoundException("Type");
		return found;
	},

	async create(data) {
		if ((await TypeRepository.getOneByName(data.name)) != null) throw new ConflictException("Type name");
		return TypeRepository.create(data);
	},

	async update(id, data) {
		await this.getOne(id);
		if (data.name) {
			const sameName = await TypeRepository.getOneByName(data.name);
			if (sameName && sameName.id != id) throw new ConflictException("Type name");
		}
		return TypeRepository.update(id, data);
	},

	async delete(id) {
		await this.getOne(id);
		return TypeRepository.delete(id);
	},
};

export default TypeService;
