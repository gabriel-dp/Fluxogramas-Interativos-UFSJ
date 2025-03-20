import prisma from "@/lib/prisma";
import { IUser } from "@/modules/user/user.model";

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
};

export default AuthRepository;
