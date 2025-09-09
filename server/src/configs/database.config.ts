import { log } from "#src/utils/log.utils";
import UserService from "#src/modules/user/user.service";

const INITIAL_ADMIN = {
	username: "admin",
	password: "@admin123",
	isAdmin: true,
};

export default async function databaseConfig() {
	const admin = await UserService.registerFirstAdminIfNotExists({ ...INITIAL_ADMIN });
	if (admin) {
		log.info(`Administrator created (${admin.id}), ${JSON.stringify(INITIAL_ADMIN)}`);
	}
}
