import z from "zod";

export const typeSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1).max(32),
});

export const createTypeSchema = typeSchema.omit({ id: true });
export type CreateTypeData = z.TypeOf<typeof createTypeSchema>;

export const updateTypeSchema = createTypeSchema.partial();
export type UpdateTypeData = z.TypeOf<typeof updateTypeSchema>;

export interface IType {
	id: number;
	name: string;
}
