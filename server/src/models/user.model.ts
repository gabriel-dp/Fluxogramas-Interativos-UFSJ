import { z } from "zod";

export const userRegistrationSchema = z.object({
	login: z.string().trim().min(4).max(64),
	password: z.string().min(8).max(64),
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
