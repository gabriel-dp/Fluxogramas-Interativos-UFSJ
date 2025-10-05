import { useCallback } from "react";
import { AxiosError } from "axios";

import useApi from "@/hooks/useApi";
import { IShift } from "@/types/course-attributes/shift";
import { ConflictException } from "@/utils/exceptionUtils";

export default function useCourseShiftService() {
	const api = useApi();
	const ENTITY = "Turno";

	const readAll = useCallback(async (): Promise<IShift[]> => {
		const result = await api.get<IShift[]>("/course/shift");
		return result.data.sort((a, b) => a.name.localeCompare(b.name));
	}, [api]);

	const createOne = useCallback(
		async (data: object): Promise<IShift> => {
			try {
				const result = await api.post<IShift>("/course/shift", data);
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
		async (id: number, data: object): Promise<IShift> => {
			try {
				const result = await api.patch<IShift>(`/course/shift/${id}`, data);
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
				const result = await api.delete<void>(`/course/shift/${id}`);
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
