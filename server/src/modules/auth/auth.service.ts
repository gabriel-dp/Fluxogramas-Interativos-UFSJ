import ms from "ms";

import {
	generateAccessToken,
	generateRefreshToken,
	encryptToken,
	validatePassword,
	validateToken,
} from "@/utils/auth.utils";
import { BadRequestException } from "@/utils/exception.utils";
import UserService from "@/modules/user/user.service";
import { IUser } from "@/modules/user/user.model";

import AuthRepository from "./auth.repository";
import { RegisterData, SignInSchema, RefreshToken } from "./auth.model";

const AuthService = {
	async register(data: RegisterData): Promise<IUser> {
		return UserService.create({ ...data, isAdmin: false });
	},

	async signIn(data: SignInSchema): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
		const user = await AuthRepository.getUserByUsername(data.username);
		if (!user) throw new BadRequestException("User sign-in username");

		const match = await validatePassword(data.password, user.password);
		if (!match) throw new BadRequestException("User sign-in password");

		const accessToken = generateAccessToken({ id: user.id, isAdmin: user.isAdmin });
		const refreshToken = generateRefreshToken({ id: user.id, isAdmin: user.isAdmin });

		await this.logout(user.id);
		await this.createRefreshToken(user.id, refreshToken);

		return { user, accessToken, refreshToken };
	},

	async createRefreshToken(userId: number, token: string): Promise<RefreshToken> {
		const tokenHash = await encryptToken(token);
		const expiresAt = new Date(Date.now() + ms((process.env.REFRESH_TOKEN_EXPIRATION as ms.StringValue) ?? "7d"));
		return await AuthRepository.createRefreshToken({ userId, tokenHash, expiresAt });
	},

	async validateRefreshToken(userId: number, token: string): Promise<boolean> {
		const existingToken = await AuthRepository.getUserRefreshToken(userId);
		if (!existingToken) return false;
		return await validateToken(token, existingToken.tokenHash);
	},

	async logout(userId: number): Promise<void> {
		await AuthRepository.deleteUserRefreshToken(userId);
	},
};

export default AuthService;
