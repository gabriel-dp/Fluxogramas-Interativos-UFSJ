import z from "zod";

export const campusSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1).max(32),
});

export const createCampusSchema = campusSchema.omit({ id: true });
export type CreateCampusData = z.TypeOf<typeof createCampusSchema>;

export const updateCampusSchema = createCampusSchema.partial();
export type UpdateCampusData = z.TypeOf<typeof updateCampusSchema>;

export interface ICampus {
	id: number;
	name: string;
}
