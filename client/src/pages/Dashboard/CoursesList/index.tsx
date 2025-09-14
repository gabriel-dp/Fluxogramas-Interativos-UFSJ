import { useCallback, useEffect, useState } from "react";
import { TableColumn } from "react-data-table-component";

import useCourseService from "@/services/courseService";
import { ICourseComplete } from "@/types/course";
import DataTable from "@/components/DataTable";
import Button from "@/components/ui/Button";
import useAuth from "@/contexts/auth/useAuth";
import SearchBar from "@/components/SearchBar";
import { normalizeString } from "@/utils/stringUtils";

import CourseForm from "./CourseForm";
import { DashboardContent } from "../styles";

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
	const { user } = useAuth();
	const { readAll } = useCourseService();
	const [search, setSearch] = useState("");
	const [courses, setCourses] = useState<ICourseComplete[]>([]);
	const [selectedCourse, setSelectedCourse] = useState<ICourseComplete | null | undefined>();

	const requestCourses = useCallback(async () => {
		setCourses(await readAll());
		setSelectedCourse(undefined);
	}, [readAll]);

	useEffect(() => {
		void requestCourses();
	}, [requestCourses]);

	if (!user?.isAdmin) return null;

	return (
		<DashboardContent>
			<div className="title-bar">
				<h1>Listagem de Cursos</h1>
				<div className="actions">
					<Button onClick={() => setSelectedCourse(null)}>Criar</Button>
				</div>
			</div>
			<SearchBar search={search} setSearch={setSearch} placeholder="Pesquise por um Curso..." />
			<DataTable
				columns={columns}
				data={courses.filter((c) => normalizeString(c.name).includes(normalizeString(search)))}
				onRowClicked={(e) => setSelectedCourse({ ...e })}
				defaultSortFieldId={1}
			/>
			<hr />
			<CourseForm selectedCourse={selectedCourse} refresh={() => void requestCourses()} />
		</DashboardContent>
	);
}
