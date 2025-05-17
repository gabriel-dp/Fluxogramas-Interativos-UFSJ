import { generateAccessToken, generateRefreshToken, encryptToken, validatePassword } from "@/utils/auth.utils";
import { BadRequestException } from "@/utils/exception.utils";
import UserService from "@/modules/user/user.service";
import { IUser } from "@/modules/user/user.model";

import AuthRepository from "./auth.repository";
import { RegisterData, SignInSchema } from "./auth.model";

const AuthService = {
	async register(data: RegisterData): Promise<IUser> {
		return UserService.create({ ...data, isAdmin: false });
	},

	async signIn(data: SignInSchema): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
		const user = await AuthRepository.getUserByLogin(data.login);
		if (!user) throw new BadRequestException("User sign-in login");

		const match = await validatePassword(data.password, user.password);
		if (!match) throw new BadRequestException("User sign-in password");

		const accessToken = generateAccessToken({ id: user.id, isAdmin: user.isAdmin });
		const refreshToken = generateRefreshToken({ id: user.id, isAdmin: user.isAdmin });

		await this.logout(user.id);
		await this.createRefreshToken(user.id, refreshToken);

		return { user, accessToken, refreshToken };
	},

	async createRefreshToken(userId: number, token: string) {
		const tokenHash = await encryptToken(token);
		return await AuthRepository.createRefreshToken(userId, tokenHash);
	},

	async validateRefreshToken(userId: number, token: string) {
		return await AuthRepository.validateRefreshToken(userId, token);
	},

	async logout(userId: number): Promise<void> {
		await AuthRepository.deleteRefreshToken(userId);
	},
};

export default AuthService;
