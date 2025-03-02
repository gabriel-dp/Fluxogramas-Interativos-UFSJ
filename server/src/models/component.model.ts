import { z } from "zod";

export const componentSchema = z.object({
	code: z.string().min(3),
	name: z.string().min(1).max(128),
	hours: z.number().positive(),
	semester: z.number().positive().min(1).nullable(),
});

export type Component = z.TypeOf<typeof componentSchema>;
