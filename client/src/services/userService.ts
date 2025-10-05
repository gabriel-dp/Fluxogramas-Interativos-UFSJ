import { useCallback } from "react";

import useApi from "@/hooks/useApi";
import { IUser } from "@/types/user";
import { AxiosError } from "axios";
import { ConflictException } from "@/utils/exceptionUtils";

export default function useUserService() {
	const api = useApi();
	const ENTITY = "Usuário";

	const readAll = useCallback(async (): Promise<IUser[]> => {
		const response = await api.get<IUser[]>("/user");
		return response.data;
	}, [api]);

	const createOne = useCallback(
		async (data: object): Promise<IUser> => {
			try {
				const response = await api.post<IUser>("/user", data);
				return response.data;
			} catch (error) {
				if (error instanceof AxiosError) {
					if (error.status === 409) {
						throw new ConflictException(ENTITY, "Login");
					}
				}
				throw error;
			}
		},
		[api],
	);

	const updateOne = useCallback(
		async (id: number, data: object): Promise<IUser> => {
			try {
				const response = await api.patch<IUser>(`/user/${id}`, data);
				return response.data;
			} catch (error) {
				if (error instanceof AxiosError) {
					if (error.status === 409) {
						throw new ConflictException(ENTITY, "Login");
					}
				}
				throw error;
			}
		},
		[api],
	);

	const deleteOne = useCallback(
		async (id: number): Promise<boolean> => {
			const response = await api.delete<void>(`/user/${id}`);
			return response.status == 204;
		},
		[api],
	);

	return { readAll, createOne, updateOne, deleteOne };
}
