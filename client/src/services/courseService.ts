import { useCallback } from "react";
import { AxiosError } from "axios";

import useApi from "@/hooks/useApi";
import { ICourseComplete, ICourseComponents } from "@/types/course";
import { ConflictException } from "@/utils/exceptionUtils";

export default function useCourseService() {
	const api = useApi();
	const ENTITY = "Curso";

	const readAll = useCallback(async (): Promise<ICourseComplete[]> => {
		const response = await api.get<ICourseComplete[]>("/course");
		return response.data;
	}, [api]);

	const readOne = useCallback(
		async (id: number): Promise<ICourseComponents> => {
			const response = await api.get<ICourseComponents>(`/course/${id}`);
			return response.data;
		},
		[api],
	);

	const createOne = useCallback(
		async (data: object): Promise<ICourseComplete> => {
			try {
				const response = await api.post<ICourseComplete>("/course", data);
				return response.data;
			} catch (error) {
				if (error instanceof AxiosError) {
					if (error.status === 409) {
						throw new ConflictException(ENTITY, "Código");
					}
				}
				throw error;
			}
		},
		[api],
	);

	const updateOne = useCallback(
		async (id: number, data: object): Promise<ICourseComplete> => {
			try {
				const response = await api.patch<ICourseComplete>(`/course/${id}`, data);
				return response.data;
			} catch (error) {
				if (error instanceof AxiosError) {
					if (error.status === 409) {
						throw new ConflictException(ENTITY, "Código");
					}
				}
				throw error;
			}
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

	const readAllByUser = useCallback(
		async (id: number): Promise<ICourseComplete[]> => {
			const response = await api.get<ICourseComplete[]>(`/permission_user_course/user/${id}`);
			return response.data;
		},
		[api],
	);

	const saveUserCourses = useCallback(
		async (id: number, data: object): Promise<boolean> => {
			const response = await api.put<void>(`/permission_user_course/user/${id}`, data);
			return response.status == 200;
		},
		[api],
	);

	const readByCode = useCallback(
		async (code: string): Promise<ICourseComponents> => {
			const response = await api.get<ICourseComponents>(`/course/code/${code}`);
			return response.data;
		},
		[api],
	);

	return { readAll, readOne, createOne, updateOne, deleteOne, readAllByUser, saveUserCourses, readByCode };
}
