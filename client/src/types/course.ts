import { z } from "zod";

import { IType } from "./course-attributes/type";
import { IShift } from "./course-attributes/shift";
import { ICampus } from "./course-attributes/campus";
import { IComponent } from "./component";

export const courseSchema = z.object({
	id: z.number().int().positive(),
	code: z.string().min(3, "Mínimo de 3 caracteres").max(10, "Máximo de 10 caracteres"),
	name: z.string().min(1, "Preencha o campo").max(128, "Máximo de 128 caracteres"),
	typeId: z.coerce.number().int().positive("Preencha o campo"),
	shiftId: z.coerce.number().int().positive("Preencha o campo"),
	campusId: z.coerce.number().int().positive("Preencha o campo"),
});

export const createCourseSchema = courseSchema.omit({ id: true });
export type CreateCourseData = z.TypeOf<typeof createCourseSchema>;

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
