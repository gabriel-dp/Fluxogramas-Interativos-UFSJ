import { z } from "zod";

export const courseSchema = z.object({
	code: z.string().min(3).max(10),
	name: z.string().min(1).max(128),
	campusId: z.number(),
	shiftId: z.number(),
	typeId: z.number(),
});

export type Course = z.TypeOf<typeof courseSchema>;
