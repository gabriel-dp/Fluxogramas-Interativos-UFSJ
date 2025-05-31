import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

import useAuth from "@/contexts/auth/useAuth";
import useApi from "@/hooks/useApi";
import { IUser } from "@/types/user";

const columns: TableColumn<IUser>[] = [
	{
		name: "Id",
		selector: (row) => row.id,
	},
	{
		name: "Usuário",
		selector: (row) => row.username,
	},
	{
		name: "Admin",
		selector: (row) => row.isAdmin,
	},
];

export default function Users() {
	const api = useApi();
	const { user } = useAuth();
	const [users, setUsers] = useState<IUser[]>([]);

	useEffect(() => {
		async function requestUsers() {
			if (user?.isAdmin) {
				const response = await api.get<IUser[]>("user");
				setUsers(response.data);
			}
		}
		void requestUsers();
	}, [api, user]);

	return (
		<>
			<DataTable columns={columns} data={users} />
		</>
	);
}
