import { Service } from "#src/modules/index";
import { ConflictException, NotFoundException } from "#src/utils/exception.utils";

import { CreateShiftData, IShift, UpdateShiftData } from "./shift.model";
import ShiftRepository from "./shift.repository";

const ShiftService: Service<IShift, CreateShiftData, UpdateShiftData> = {
	async getAll() {
		return ShiftRepository.getAll();
	},

	async getOne(id) {
		const found = await ShiftRepository.getOne(id);
		if (!found) throw new NotFoundException("Shift");
		return found;
	},

	async create(data) {
		if ((await ShiftRepository.getOneByName(data.name)) != null) throw new ConflictException("Shift name");
		return ShiftRepository.create(data);
	},

	async update(id, data) {
		await this.getOne(id);
		if (data.name) {
			const sameName = await ShiftRepository.getOneByName(data.name);
			if (sameName && sameName.id != id) throw new ConflictException("Shift name");
		}
		return ShiftRepository.update(id, data);
	},

	async delete(id) {
		await this.getOne(id);
		return ShiftRepository.delete(id);
	},
};

export default ShiftService;
