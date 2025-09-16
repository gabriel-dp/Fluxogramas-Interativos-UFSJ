import { z, ZodEffects, ZodNumber, ZodOptional } from "zod";

export enum ComponentType {
	SUBJECT = "SUBJECT",
	ACTIVITY = "ACTIVITY",
}

export const componentSchema = z.object({
	id: z.number().int().positive(),
	code: z.string().min(1, "Preencha o campo").max(32, "Máximo de 32 caracteres"),
	name: z.string().min(1, "Preencha o campo").max(128, "Máximo de 128 caracteres"),
	hours: z.preprocess(
		(val) => {
			if (val === "" || val === null || val === undefined) return undefined;
			const n = Number(val);
			return isNaN(n) ? undefined : n;
		},
		z.number({ required_error: "Preencha o campo" }).int().nonnegative("Apenas valores positivos"),
	) as ZodEffects<ZodNumber, number, number>,
	type: z.enum(["SUBJECT", "ACTIVITY"], { message: "Preencha o campo" }).transform((val) => val as ComponentType),
	semester: z.preprocess((val) => {
		if (val === "" || val === null || val === undefined) return undefined;
		const n = Number(val);
		return isNaN(n) ? undefined : n;
	}, z.number().int().positive("Apenas valores positivos").optional()) as ZodEffects<
		ZodOptional<ZodNumber>,
		number,
		number | null
	>,
	courseId: z.number().int().positive(),
});

export const createComponentSchema = componentSchema.omit({ id: true, courseId: true });
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
	type: ComponentType;
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
