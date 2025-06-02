import { useEffect, useState } from "react";
import { TableColumn } from "react-data-table-component";

import useAuth from "@/contexts/auth/useAuth";
import useApi from "@/hooks/useApi";
import { IUser } from "@/types/user";
import DataTable from "@/components/DataTable";

const columns: TableColumn<IUser>[] = [
	{
		name: "Id",
		selector: (row) => row.id,
		sortable: true,
	},
	{
		name: "Nome",
		selector: (row) => row.username,
		sortable: true,
	},
	{
		name: "Administrador?",
		selector: (row) => (row.isAdmin ? "Sim" : "Não"),
		sortable: true,
	},
];

export default function UsersList() {
	const api = useApi();
	const { user } = useAuth();
	const [users, setUsers] = useState<IUser[]>([]);
	const [selectedUser, setSelectedUser] = useState<IUser | undefined>();

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
		<div>
			<h1>Listagem de Usuários</h1>
			<DataTable columns={columns} data={users} onRowClicked={(e) => setSelectedUser(e)} />
			<>{JSON.stringify(selectedUser)}</>
		</div>
	);
}
