import { useCallback, useEffect, useState } from "react";
import { TableColumn } from "react-data-table-component";

import useUserService from "@/services/userService";
import { IUser } from "@/types/user";
import DataTable from "@/components/DataTable";
import Button from "@/components/ui/Button";

import UserForm from "./UserForm";
import UserPermissionForm from "./UserPermissionForm";
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
	const [users, setUsers] = useState<IUser[]>([]);
	const [selectedUser, setSelectedUser] = useState<IUser | null | undefined>();

	const { readAll: readAllUsers } = useUserService();

	const requestUsers = useCallback(async () => {
		setUsers(await readAllUsers());
		setSelectedUser(undefined);
	}, [readAllUsers]);

	useEffect(() => {
		void requestUsers();
	}, [requestUsers]);

	return (
		<DashboardContent>
			<div className="title-bar">
				<h1>Listagem de Usuários</h1>
				<div className="actions">
					<Button onClick={() => setSelectedUser(null)}>Criar</Button>
				</div>
			</div>
			<DataTable
				columns={columns}
				data={users}
				onRowClicked={(e) => setSelectedUser({ ...e })}
				defaultSortFieldId={1}
			/>
			<UserForm selectedUser={selectedUser} refresh={() => void requestUsers()} />
			<UserPermissionForm selectedUser={selectedUser} />
		</DashboardContent>
	);
}
