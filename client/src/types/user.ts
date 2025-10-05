import { z } from "zod";

export const userSchema = z.object({
	id: z.number().int().positive(),
	username: z.string().trim().min(4, "Mínimo de 4 caracteres").max(64, "Máximo de 64 caracteres"),
	password: z.string().min(8, "Mínimo de 8 caracteres").max(64, "Máximo de 64 caracteres"),
	isAdmin: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const createUserSchema = userSchema.pick({ username: true, password: true, isAdmin: true });
export type CreateUserData = z.TypeOf<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.pick({ username: true, isAdmin: true });
export type UpdateUserData = z.TypeOf<typeof updateUserSchema>;

export interface IUser {
	id: number;
	username: string;
	password?: string;
	isAdmin: boolean;
}
