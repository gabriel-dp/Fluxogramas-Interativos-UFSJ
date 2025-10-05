import dotenv from "dotenv";

const ENVIRONMENTS = {
	development: "development",
	test: "test",
	production: "production",
};

const DEFAULT_ENV = "development";

function config() {
	const env = process.env.NODE_ENV || DEFAULT_ENV;
	const selected: string | undefined = ENVIRONMENTS[env as keyof typeof ENVIRONMENTS];

	if (!selected) {
		throw new Error(`Unknown environment: ${env}`);
	}

	if (selected != ENVIRONMENTS.production) {
		dotenv.config({ path: `.env.${selected}` });
	} else {
		dotenv.config();
	}
}

// Overrides dotenv.config()
export default { ...dotenv, config };
