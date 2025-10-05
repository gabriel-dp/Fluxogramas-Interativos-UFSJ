import { useCallback } from "react";

import useApi from "@/hooks/useApi";
import { IType } from "@/types/course-attributes/type";
import { AxiosError } from "axios";
import { ConflictException } from "@/utils/exceptionUtils";

export default function useCourseTypeService() {
	const api = useApi();
	const ENTITY = "Tipo";

	const readAll = useCallback(async (): Promise<IType[]> => {
		const result = await api.get<IType[]>("/course/type");
		return result.data.sort((a, b) => a.name.localeCompare(b.name));
	}, [api]);

	const createOne = useCallback(
		async (data: object): Promise<IType> => {
			try {
				const result = await api.post<IType>("/course/type", data);
				return result.data;
			} catch (error) {
				if (error instanceof AxiosError) {
					if (error.status === 409) {
						throw new ConflictException(ENTITY, "Nome");
					}
				}
				throw error;
			}
		},
		[api],
	);

	const updateOne = useCallback(
		async (id: number, data: object): Promise<IType> => {
			try {
				const result = await api.patch<IType>(`/course/type/${id}`, data);
				return result.data;
			} catch (error) {
				if (error instanceof AxiosError) {
					if (error.status === 409) {
						throw new ConflictException(ENTITY, "Nome");
					}
				}
				throw error;
			}
		},
		[api],
	);

	const deleteOne = useCallback(
		async (id: number): Promise<boolean> => {
			try {
				const result = await api.delete<void>(`/course/type/${id}`);
				return result.status == 204;
			} catch (error) {
				if (error instanceof AxiosError) {
					if (error.status === 409) {
						throw new ConflictException(ENTITY);
					}
				}
				throw error;
			}
		},
		[api],
	);

	return { readAll, createOne, updateOne, deleteOne };
}
