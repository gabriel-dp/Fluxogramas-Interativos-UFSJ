import { z } from "zod";

export const userRegistrationSchema = z.object({
	login: z.string().min(8),
	password: z.string().min(8),
	isAdmin: z.boolean().optional().default(false),
});

export const userSignInSchema = userRegistrationSchema.pick({ login: true, password: true });

export const userSchema = userRegistrationSchema.pick({ login: true, isAdmin: true });

export type User = z.TypeOf<typeof userSchema>;
