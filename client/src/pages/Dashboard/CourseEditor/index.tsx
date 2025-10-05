import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import { ComponentType, IComponent } from "@/types/component";
import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/ui/SearchBar";
import { normalizeString } from "@/utils/stringUtils";
import useModal from "@/contexts/modal/useModal";
import ComponentForm from "./ComponentForm";
import RequisiteForm from "./RequisitesForm";
import Curriculum from "@/components/curriculum/Curriculum";
import useCourseService from "@/services/courseService";
import { ICourseComponents } from "@/types/course";

import { CurriculumModal } from "./styles";
import { DashboardContent } from "../styles";

const columns: TableColumn<IComponent>[] = [
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
		name: "Semestre",
		selector: (row) => row.semester ?? "-",
		sortable: true,
	},
	{
		name: "Carga Horária",
		selector: (row) => row.hours,
		sortable: true,
	},
	{
		name: "Tipo",
		selector: (row) => {
			switch (row.type) {
				case ComponentType.SUBJECT:
					return "Disciplina";
				case ComponentType.ACTIVITY:
					return "Atividade";
				case ComponentType.OPTIONAL:
					return "Optativa";
				case ComponentType.ELECTIVE:
					return "Eletiva";
				default:
					return "Desconhecido";
			}
		},
		sortable: true,
	},
];

export default function CourseEditor() {
	const { id } = useParams();
	const { readOne } = useCourseService();
	const { openModal } = useModal();
	const [search, setSearch] = useState("");
	const [course, setCourse] = useState<ICourseComponents | undefined>();
	const [selectedComponent, setSelectedComponent] = useState<IComponent | null | undefined>();

	const requestCourse = useCallback(async () => {
		setCourse(await readOne(Number(id)));
	}, [id, readOne]);

	useEffect(() => {
		void requestCourse();
		setSelectedComponent(undefined);
	}, [requestCourse]);

	function openCurriculum() {
		if (course) {
			openModal({
				content: (
					<CurriculumModal>
						<Curriculum course={course} />
					</CurriculumModal>
				),
				noPadding: true,
			});
		}
	}

	return (
		<DashboardContent>
			<div className="title-bar">
				<h1>Listagem de Componentes</h1>
				<div className="actions">
					<Button onClick={() => openCurriculum()} category="secondary">
						Visualizar grade
					</Button>
					<Button onClick={() => setSelectedComponent(null)}>Criar</Button>
				</div>
			</div>
			<SearchBar search={search} setSearch={setSearch} placeholder="Pesquise por um Componente..." />
			<DataTable
				columns={columns}
				data={!course ? [] : course.components.filter((c) => normalizeString(c.name).includes(normalizeString(search)))}
				onRowClicked={(e) => setSelectedComponent({ ...e })}
				defaultSortFieldId={1}
			/>
			<hr />
			<ComponentForm
				courseId={Number(id)}
				selectedComponent={selectedComponent}
				refresh={() => {
					void requestCourse();
					setSelectedComponent(undefined);
				}}
			/>
			{selectedComponent && (
				<RequisiteForm
					components={!course ? [] : course.components}
					selectedComponent={selectedComponent}
					refresh={() => {
						void requestCourse();
					}}
				/>
			)}
		</DashboardContent>
	);
}
