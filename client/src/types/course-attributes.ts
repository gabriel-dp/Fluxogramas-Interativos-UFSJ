import z from "zod";

export const attributeSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1, "Preencha o campo").max(32, "Máximo de 32 caracteres"),
});

export const createAttributeSchema = attributeSchema.omit({ id: true });
export type CreateAttributeData = z.TypeOf<typeof createAttributeSchema>;

export interface IAttribute {
	id: number;
	name: string;
}
