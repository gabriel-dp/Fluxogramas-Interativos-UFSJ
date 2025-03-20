import { validatePassword } from "@/utils/auth.utils";
import { BadRequestException } from "@/utils/exception.utils";
import UserService from "@/modules/user/user.service";

import AuthRepository from "./auth.repository";
import { RegisterData, SignInSchema } from "./auth.model";

const AuthService = {
	async register(data: RegisterData) {
		return UserService.create({ ...data, isAdmin: false });
	},

	async signIn(data: SignInSchema) {
		const user = await AuthRepository.getUserByLogin(data.login);
		if (!user) throw new BadRequestException("User sign-in login");

		const match = await validatePassword(data.password, user.password);
		if (!match) throw new BadRequestException("User sign-in password");

		return user;
	},
};

export default AuthService;
