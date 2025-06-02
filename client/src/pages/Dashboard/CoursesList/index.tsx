import { useEffect, useState } from "react";
import { TableColumn } from "react-data-table-component";

import useAuth from "@/contexts/auth/useAuth";
import useApi from "@/hooks/useApi";
import { ICourseComplete } from "@/types/course";
import DataTable from "@/components/DataTable";

const columns: TableColumn<ICourseComplete>[] = [
	{
		name: "Id",
		selector: (row) => row.id,
		sortable: true,
	},
	{
		name: "Código",
		selector: (row) => row.code,
		sortable: true,
	},
	{
		name: "Nome",
		selector: (row) => row.name,
		sortable: true,
	},
	{
		name: "Tipo",
		selector: (row) => row.type.name,
		sortable: true,
	},
	{
		name: "Turno",
		selector: (row) => row.shift.name,
		sortable: true,
	},
	{
		name: "Campus",
		selector: (row) => row.campus.name,
		sortable: true,
	},
];

export default function Course() {
	const api = useApi();
	const { user } = useAuth();
	const [courses, setCourses] = useState<ICourseComplete[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<ICourseComplete | undefined>();

	useEffect(() => {
		async function requestUsers() {
			if (user?.isAdmin) {
				const response = await api.get<ICourseComplete[]>("course");
				setCourses(response.data);
			}
		}
		void requestUsers();
	}, [api, user]);

	return (
		<div>
			<h1>Listagem de Cursos</h1>
			<DataTable columns={columns} data={courses} onRowClicked={(e) => setSelectedCourse(e)} />
			<>{JSON.stringify(selectedCourse)}</>
		</div>
	);
}
