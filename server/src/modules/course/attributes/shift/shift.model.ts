import z from "zod";

export const shiftSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1).max(32),
});

export const createShiftSchema = shiftSchema.omit({ id: true });
export type CreateShiftData = z.TypeOf<typeof createShiftSchema>;

export const updateShiftSchema = createShiftSchema.partial();
export type UpdateShiftData = z.TypeOf<typeof updateShiftSchema>;

export interface IShift {
	id: number;
	name: string;
}
