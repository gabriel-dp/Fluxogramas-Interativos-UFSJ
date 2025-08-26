import { z } from "zod";

import { IType } from "./course-attributes/type";
import { IShift } from "./course-attributes/shift";
import { ICampus } from "./course-attributes/campus";
import { IComponent } from "./component";

export const courseSchema = z.object({
	id: z.number().int().positive(),
	code: z.string().min(3).max(10),
	name: z.string().min(1).max(128),
	campusId: z.number().int().positive(),
	shiftId: z.number().int().positive(),
	typeId: z.number().int().positive(),
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

export interface ICourseComplete extends Omit<ICourse, "typeId" | "shiftId" | "campusId"> {
	type: IType;
	shift: IShift;
	campus: ICampus;
}

export interface ICourseComponents extends ICourseComplete {
	components: IComponent[];
}
