import "tsconfig-paths/register"; // This import is necessary to configure "#src/" aliases

import UserService from "#src/modules/user/user.service";
import { log } from "#src/utils/log.utils";

import { NORMAL_CREDENTIALS } from "./tests.credentials";

async function globalSetup() {
	await UserService.create({ ...NORMAL_CREDENTIALS });
	log.info(`Test user created, ${JSON.stringify(NORMAL_CREDENTIALS)}`);
}

export default globalSetup;
