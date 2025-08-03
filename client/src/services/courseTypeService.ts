import { useCallback } from "react";

import useApi from "@/hooks/useApi";
import { IType } from "@/types/course-attributes/type";

export default function useCourseTypeService() {
	const api = useApi();

	const readAll = useCallback(async (): Promise<IType[]> => {
		const result = await api.get<IType[]>("/course/type");
		return result.data;
	}, [api]);

	const createOne = useCallback(
		async (data: object): Promise<IType> => {
			const result = await api.post<IType>("/course/type", data);
			return result.data;
		},
		[api],
	);

	const updateOne = useCallback(
		async (id: number, data: object): Promise<IType> => {
			const result = await api.patch<IType>(`/course/type/${id}`, data);
			return result.data;
		},
		[api],
	);

	const deleteOne = useCallback(
		async (id: number): Promise<boolean> => {
			const result = await api.delete<void>(`/course/type/${id}`);
			return result.status == 204;
		},
		[api],
	);

	return { readAll, createOne, updateOne, deleteOne };
}
