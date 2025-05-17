import { z } from "zod";

export const userSchema = z.object({
	id: z.number().int().positive(),
	username: z.string().trim().min(4).max(64),
	password: z.string().min(8).max(64),
	isAdmin: z.boolean().optional().default(false),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const createUserSchema = userSchema.pick({ username: true, password: true, isAdmin: true });
export type CreateUserData = z.TypeOf<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();
export type UpdateUserData = z.TypeOf<typeof updateUserSchema>;

export interface IUser {
	id: number;
	username: string;
	password?: string;
	isAdmin: boolean;
}
