import { z } from "zod";

export enum ComponentType {
	SUBJECT = "SUBJECT",
	ACTIVITY = "ACTIVITY",
}

export const componentSchema = z.object({
	id: z.number().int().positive(),
	code: z.string().min(1).max(32),
	name: z.string().min(1).max(128),
	hours: z.number().int().nonnegative(),
	type: z.nativeEnum(ComponentType),
	semester: z.number().int().positive().nullable(),
	courseId: z.number().int().positive(),
});

export const createComponentSchema = componentSchema.omit({ id: true });
export type CreateComponentData = z.TypeOf<typeof createComponentSchema>;

export const updateComponentSchema = createComponentSchema.partial();
export type UpdateComponentData = z.TypeOf<typeof updateComponentSchema>;

export interface Requisite {
	id: number;
	corequisite: boolean;
}

export interface IComponent {
	id: number;
	code: string;
	name: string;
	hours: number;
	type: string;
	semester: number | null;
	courseId: number;
	requisites: Requisite[];
}

export const setRequisitesSchema = z.object({
	requisites: z.array(
		z.object({
			id: z.number().int().positive(),
			corequisite: z.boolean().optional().default(false),
		}),
	),
});
export type SetRequisitesData = z.TypeOf<typeof setRequisitesSchema>;
