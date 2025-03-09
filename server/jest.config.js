/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
	testEnvironment: "node",
	transform: {
		"^.+.ts$": ["ts-jest", {}],
	},
	globalSetup: "./src/__test__/setup.tests.ts",
};
