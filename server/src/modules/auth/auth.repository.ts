import prisma from "@/lib/prisma";
import { IUser } from "@/modules/user/user.model";

import { RefreshToken } from "./auth.model";
import { validateToken } from "@/utils/auth.utils";

const AuthRepository = {
	async getUserByLogin(login: string): Promise<(IUser & { password: string }) | null> {
		return prisma.user.findFirst({
			where: { login },
			select: {
				id: true,
				login: true,
				password: true,
				isAdmin: true,
			},
		});
	},

	async createRefreshToken(userId: number, tokenHash: string): Promise<RefreshToken> {
		return prisma.refreshToken.create({
			data: { userId, tokenHash },
			select: {
				id: true,
				userId: true,
				tokenHash: true,
				createdAt: true,
			},
		});
	},

	async validateRefreshToken(userId: number, token: string): Promise<boolean> {
		const tokenData = await prisma.refreshToken.findFirst({
			where: { userId },
		});
		if (!tokenData) return false;
		return await validateToken(token, tokenData.tokenHash);
	},

	async deleteRefreshToken(userId: number) {
		return prisma.refreshToken.deleteMany({
			where: { userId },
		});
	},
};

export default AuthRepository;
