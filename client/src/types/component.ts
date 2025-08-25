import { z } from "zod";

export const componentSchema = z.object({
	id: z.number().int().positive(),
	code: z.string().min(1).max(32),
	name: z.string().min(1).max(128),
	hours: z.number().int().nonnegative(),
	type: z.enum(["SUBJECT", "ACTIVITY"]),
	semester: z.number().int().positive().optional(),
	courseId: z.number().int().positive(),
});

export const createComponentSchema = componentSchema.omit({ id: true });
export type CreateComponentData = z.TypeOf<typeof createComponentSchema>;

export const updateComponentSchema = createComponentSchema.partial();
export type UpdateComponentData = z.TypeOf<typeof updateComponentSchema>;

export interface IComponent {
	id: number;
	code: string;
	name: string;
	hours: number;
	type: string;
	semester: number | null;
	courseId: number;
	requisites: number[];
}

export const setComponentsSchema = z.object({
	components: z.array(
		componentSchema.omit({ courseId: true }).extend({ requisites: z.array(z.string().min(1).min(32)) }),
	),
});
export type SetComponentsData = z.TypeOf<typeof setComponentsSchema>;
