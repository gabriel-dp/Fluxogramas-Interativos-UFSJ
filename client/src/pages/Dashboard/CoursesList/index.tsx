import { useCallback, useEffect, useState } from "react";
import { TableColumn } from "react-data-table-component";

import useCourseService from "@/services/courseService";
import { ICourseComplete } from "@/types/course";
import DataTable from "@/components/DataTable";
import Button from "@/components/ui/Button";

import { DashboardContent } from "../styles";
import CourseForm from "./CourseForm";

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
	const { readAll } = useCourseService();
	const [courses, setCourses] = useState<ICourseComplete[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<ICourseComplete | null | undefined>();

	const requestCourses = useCallback(async () => {
		setCourses(await readAll());
		setSelectedCourse(undefined);
	}, [readAll]);

	useEffect(() => {
		void requestCourses();
	}, [requestCourses]);

	return (
		<DashboardContent>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<h1>Listagem de Cursos</h1>
				<Button onClick={() => setSelectedCourse(null)}>Criar</Button>
			</div>
			<DataTable columns={columns} data={courses} onRowClicked={(e) => setSelectedCourse(e)} />
			<CourseForm selectedCourse={selectedCourse} refresh={() => void requestCourses()} />
		</DashboardContent>
	);
}
