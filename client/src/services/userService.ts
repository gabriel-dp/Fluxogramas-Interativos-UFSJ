import useApi from "@/hooks/useApi";
import { IUser } from "@/types/user";
import { useCallback } from "react";

export default function useUserService() {
	const api = useApi();

	const readAll = useCallback(async (): Promise<IUser[]> => {
		const response = await api.get<IUser[]>("/user");
		return response.data;
	}, [api]);

	const createOne = useCallback(
		async (data: object): Promise<IUser> => {
			const response = await api.post<IUser>("/user", data);
			return response.data;
		},
		[api],
	);

	const updateOne = useCallback(
		async (data: Partial<IUser> & { id: number }): Promise<IUser> => {
			const response = await api.patch<IUser>(`/user/${data.id}`, data);
			return response.data;
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
