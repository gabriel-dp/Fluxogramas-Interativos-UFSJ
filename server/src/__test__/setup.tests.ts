import { api } from "./utils.tests";
import { NORMAL_CREDENTIALS } from "./consts.tests";

async function globalSetup() {
	await api.post("/auth/register", NORMAL_CREDENTIALS);
	console.log(`Test user created,`, NORMAL_CREDENTIALS);
}

export default globalSetup;
