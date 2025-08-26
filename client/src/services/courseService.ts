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
		async (code: string): Promise<ICourseComplete> => {
			const response = await api.get<ICourseComplete>(`/course/code/${code}`);
			return response.data;
		},
		[api],
	);

	return { readAll, createOne, updateOne, deleteOne, readAllByUser, saveUserCourses, readByCode };
}
