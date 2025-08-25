import { useCallback } from "react";

import useApi from "@/hooks/useApi";
import { IComponent } from "@/types/component";

export default function useComponentService() {
	const api = useApi();

	const createOne = useCallback(
		async (data: object): Promise<IComponent> => {
			const result = await api.post<IComponent>("/component", data);
			return result.data;
		},
		[api],
	);

	const updateOne = useCallback(
		async (id: number, data: object): Promise<IComponent> => {
			const result = await api.patch<IComponent>(`/component/${id}`, data);
			return result.data;
		},
		[api],
	);

	const deleteOne = useCallback(
		async (id: number): Promise<boolean> => {
			const result = await api.delete<void>(`/component/${id}`);
			return result.status == 204;
		},
		[api],
	);

	const readComponents = useCallback(
		async (courseId: number): Promise<IComponent[]> => {
			const result = await api.get<IComponent[]>(`/component/course/${courseId}`);
			return result.data;
		},
		[api],
	);

	const setComponents = useCallback(
		async (courseId: number, data: object): Promise<IComponent[]> => {
			const result = await api.put<IComponent[]>(`/component/course/${courseId}`, data);
			return result.data;
		},
		[api],
	);

	return { createOne, updateOne, deleteOne, readComponents, setComponents };
}
