import { useCallback } from "react";

import useApi from "@/hooks/useApi";
import { ICampus } from "@/types/course-attributes/campus";

export default function useCourseCampusService() {
	const api = useApi();

	const readAll = useCallback(async (): Promise<ICampus[]> => {
		const result = await api.get<ICampus[]>("/course/campus");
		return result.data.sort((a, b) => a.name.localeCompare(b.name));
	}, [api]);

	const createOne = useCallback(
		async (data: object): Promise<ICampus> => {
			const result = await api.post<ICampus>("/course/campus", data);
			return result.data;
		},
		[api],
	);

	const updateOne = useCallback(
		async (id: number, data: object): Promise<ICampus> => {
			const result = await api.patch<ICampus>(`/course/campus/${id}`, data);
			return result.data;
		},
		[api],
	);

	const deleteOne = useCallback(
		async (id: number): Promise<boolean> => {
			const result = await api.delete<void>(`/course/campus/${id}`);
			return result.status == 204;
		},
		[api],
	);

	return { readAll, createOne, updateOne, deleteOne };
}
