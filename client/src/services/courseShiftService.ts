import { useCallback } from "react";

import useApi from "@/hooks/useApi";
import { IShift } from "@/types/course-attributes/shift";

export default function useCourseShiftService() {
	const api = useApi();

	const readAll = useCallback(async (): Promise<IShift[]> => {
		const result = await api.get<IShift[]>("/course/shift");
		return result.data.sort((a, b) => a.name.localeCompare(b.name));
	}, [api]);

	const createOne = useCallback(
		async (data: object): Promise<IShift> => {
			const result = await api.post<IShift>("/course/shift", data);
			return result.data;
		},
		[api],
	);

	const updateOne = useCallback(
		async (id: number, data: object): Promise<IShift> => {
			const result = await api.patch<IShift>(`/course/shift/${id}`, data);
			return result.data;
		},
		[api],
	);

	const deleteOne = useCallback(
		async (id: number): Promise<boolean> => {
			const result = await api.delete<void>(`/course/shift/${id}`);
			return result.status == 204;
		},
		[api],
	);

	return { readAll, createOne, updateOne, deleteOne };
}
