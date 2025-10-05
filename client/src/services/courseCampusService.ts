import { useCallback } from "react";
import { AxiosError } from "axios";

import useApi from "@/hooks/useApi";
import { ICampus } from "@/types/course-attributes/campus";
import { ConflictException } from "@/utils/exceptionUtils";

export default function useCourseCampusService() {
	const api = useApi();
	const ENTITY = "Campus";

	const readAll = useCallback(async (): Promise<ICampus[]> => {
		const result = await api.get<ICampus[]>("/course/campus");
		return result.data.sort((a, b) => a.name.localeCompare(b.name));
	}, [api]);

	const createOne = useCallback(
		async (data: object): Promise<ICampus> => {
			try {
				const result = await api.post<ICampus>("/course/campus", data);
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
		async (id: number, data: object): Promise<ICampus> => {
			try {
				const result = await api.patch<ICampus>(`/course/campus/${id}`, data);
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
				const result = await api.delete<void>(`/course/campus/${id}`);
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
