import { useCallback } from "react";

import useApi from "@/hooks/useApi";
import { ICourseComplete } from "@/types/course";

export default function useCourseService() {
	const api = useApi();

	const readAll = useCallback(async (): Promise<ICourseComplete[]> => {
		const response = await api.get<ICourseComplete[]>("/course");
		return response.data;
	}, [api]);

	const createOne = useCallback(
		async (data: object): Promise<ICourseComplete> => {
			const response = await api.post<ICourseComplete>("/course", data);
			return response.data;
		},
		[api],
	);

	const updateOne = useCallback(
		async (id: number, data: object): Promise<ICourseComplete> => {
			const response = await api.patch<ICourseComplete>(`/course/${id}`, data);
			return response.data;
		},
		[api],
	);

	const deleteOne = useCallback(
		async (id: number): Promise<boolean> => {
			const response = await api.delete<void>(`/course/${id}`);
			return response.status == 204;
		},
		[api],
	);

	return { readAll, createOne, updateOne, deleteOne };
}
