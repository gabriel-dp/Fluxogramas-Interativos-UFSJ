import { useCallback, useEffect, useState } from "react";
import { TableColumn } from "react-data-table-component";

import useUserService from "@/services/userService";
import useAuth from "@/contexts/auth/useAuth";
import { IUser } from "@/types/user";
import DataTable from "@/components/DataTable";
import Button from "@/components/ui/Button";

import UserForm from "./UserForm";
import { DashboardContent } from "../styles";

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
	const { readAll } = useUserService();
	const { user } = useAuth();
	const [users, setUsers] = useState<IUser[]>([]);
	const [selectedUser, setSelectedUser] = useState<IUser | null | undefined>();

	const requestUsers = useCallback(async () => {
		if (user?.isAdmin) {
			setUsers(await readAll());
		}
		setSelectedUser(undefined);
	}, [readAll, user]);

	useEffect(() => {
		void requestUsers();
	}, [requestUsers]);

	return (
		<DashboardContent>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<h1>Listagem de Usuários</h1>
				<Button onClick={() => setSelectedUser(null)}>Criar</Button>
			</div>
			<DataTable columns={columns} data={users} onRowClicked={(e) => setSelectedUser(e)} defaultSortFieldId={1} />
			<UserForm selectedUser={selectedUser} refresh={() => void requestUsers()} />
		</DashboardContent>
	);
}
