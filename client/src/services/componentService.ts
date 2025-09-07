import { useCallback } from "react";
import { AxiosError } from "axios";

import useApi from "@/hooks/useApi";
import { IComponent } from "@/types/component";
import { ConflictException } from "@/utils/exceptionUtils";

export default function useComponentService() {
	const api = useApi();
	const ENTITY = "Componente";

	const createOne = useCallback(
		async (data: object): Promise<IComponent> => {
			try {
				const result = await api.post<IComponent>("/component", data);
				return result.data;
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
		async (id: number, data: object): Promise<IComponent> => {
			try {
				const result = await api.patch<IComponent>(`/component/${id}`, data);
				return result.data;
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

	const setRequisites = useCallback(
		async (id: number, data: object): Promise<IComponent> => {
			const result = await api.put<IComponent>(`/component/requisites/${id}`, data);
			return result.data;
		},
		[api],
	);

	return { createOne, updateOne, deleteOne, readComponents, setRequisites };
}
