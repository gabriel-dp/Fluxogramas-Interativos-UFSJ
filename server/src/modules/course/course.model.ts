import { z } from "zod";

import { IType } from "./attributes/type/type.model";
import { IShift } from "./attributes/shift/shift.model";
import { ICampus } from "./attributes/campus/campus.model";

export const courseSchema = z.object({
	id: z.number().int().positive(),
	code: z.string().min(3).max(10),
	name: z.string().min(1).max(128),
	campusId: z.number(),
	shiftId: z.number(),
	typeId: z.number(),
});

export const createCourseSchema = courseSchema.omit({ id: true });
export type CreateCourseData = z.TypeOf<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.partial();
export type UpdateCourseData = z.TypeOf<typeof updateCourseSchema>;

export interface ICourse {
	id: number;
	code: string;
	name: string;
	typeId: number;
	shiftId: number;
	campusId: number;
}

export interface ICourseComplete extends ICourse {
	type: IType;
	shift: IShift;
	campus: ICampus;
}
