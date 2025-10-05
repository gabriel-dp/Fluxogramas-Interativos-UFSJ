import prisma from "../../lib/prisma";
import { IUser } from "../../modules/user/user.model";
import { RefreshToken } from "./auth.model";

const AuthRepository = {
	async getUserByUsername(username: string): Promise<(IUser & { password: string }) | null> {
		return prisma.user.findFirst({
			where: { username },
			select: {
				id: true,
				username: true,
				password: true,
				isAdmin: true,
			},
		});
	},

	async createRefreshToken(tokenData: Pick<RefreshToken, "userId" | "tokenHash" | "expiresAt">): Promise<RefreshToken> {
		return prisma.refreshToken.create({
			data: { ...tokenData },
			select: {
				id: true,
				userId: true,
				tokenHash: true,
				createdAt: true,
				expiresAt: true,
			},
		});
	},

	async getUserRefreshToken(userId: number): Promise<RefreshToken | null> {
		return prisma.refreshToken.findFirst({
			where: { userId },
		});
	},

	async deleteUserRefreshToken(userId: number): Promise<void> {
		await prisma.refreshToken.deleteMany({
			where: { userId },
		});
	},
};

export default AuthRepository;
