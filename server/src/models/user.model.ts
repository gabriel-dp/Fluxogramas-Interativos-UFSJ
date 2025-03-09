import { z } from "zod";

export const userRegistrationSchema = z.object({
	login: z.string().min(4),
	password: z.string().min(8),
	isAdmin: z.boolean().optional().default(false),
});

export const userSignInSchema = z.object({
	login: z.string(),
	password: z.string(),
});

export const userUpdateSchema = userRegistrationSchema.partial();

export type User = {
	login: string;
	isAdmin: string;
};
