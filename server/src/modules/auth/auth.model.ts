import { z } from "zod";

import { userSchema } from "@/modules/user/user.model";

export const registerSchema = userSchema.pick({ login: true, password: true });
export type RegisterData = z.TypeOf<typeof registerSchema>;

export const signInSchema = z.object({
	login: z.string(),
	password: z.string(),
});
export type SignInSchema = z.TypeOf<typeof signInSchema>;

export type RefreshToken = {
	id: number;
	userId: number;
	tokenHash: string;
	createdAt: Date;
	expiresAt: Date;
};
