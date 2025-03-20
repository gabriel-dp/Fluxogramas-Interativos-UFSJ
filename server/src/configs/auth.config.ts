import UserService from "@/modules/user/user.service";

const INITIAL_ADMIN = {
	login: "admin",
	password: "@admin123",
	isAdmin: true,
};

export default async function authConfig() {
	const admin = await UserService.registerFirstAdminIfNotExists({ ...INITIAL_ADMIN });
	if (admin) {
		console.log(`Administrator created (${admin.id}),`, INITIAL_ADMIN);
	}
}
