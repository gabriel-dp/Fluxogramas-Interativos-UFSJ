import { z } from "zod";

import { userSchema } from "#src/modules/user/user.model";

export const registerSchema = userSchema.pick({ username: true, password: true });
export type RegisterData = z.TypeOf<typeof registerSchema>;

export const signInSchema = z.object({
	username: z.string(),
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
