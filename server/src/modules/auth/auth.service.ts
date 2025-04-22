import { generateToken, validatePassword } from "@/utils/auth.utils";
import { BadRequestException } from "@/utils/exception.utils";
import UserService from "@/modules/user/user.service";
import { IUser } from "@/modules/user/user.model";

import AuthRepository from "./auth.repository";
import { RegisterData, SignInSchema } from "./auth.model";

const AuthService = {
	async register(data: RegisterData): Promise<IUser> {
		return UserService.create({ ...data, isAdmin: false });
	},

	async signIn(data: SignInSchema): Promise<IUser & { token: string }> {
		const user = await AuthRepository.getUserByLogin(data.login);
		if (!user) throw new BadRequestException("User sign-in login");

		const match = await validatePassword(data.password, user.password);
		if (!match) throw new BadRequestException("User sign-in password");

		const token = generateToken({ id: user.id, isAdmin: user.isAdmin });
		return { ...user, token };
	},
};

export default AuthService;
