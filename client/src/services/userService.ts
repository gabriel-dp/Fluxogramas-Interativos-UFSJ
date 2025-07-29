import useApi from "@/hooks/useApi";
import { IUser } from "@/types/user";
import { useCallback } from "react";

export default function useUserService() {
	const api = useApi();

	const readAll = useCallback(async (): Promise<IUser[]> => {
		const response = await api.get<IUser[]>("/user");
		return response.data;
	}, [api]);

	const create = useCallback(
		async (data: object): Promise<IUser> => {
			const response = await api.post<IUser>("/user", data);
			return response.data;
		},
		[api],
	);

	const update = useCallback(
		async (data: Partial<IUser> & { id: number }): Promise<IUser> => {
			const response = await api.patch<IUser>(`/user/${data.id}`, data);
			return response.data;
		},
		[api],
	);

	return { readAll, create, update };
}
