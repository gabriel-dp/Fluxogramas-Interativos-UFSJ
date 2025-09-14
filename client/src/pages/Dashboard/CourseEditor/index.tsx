import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import useComponentService from "@/services/componentService";
import { ComponentType, IComponent } from "@/types/component";
import DataTable from "@/components/DataTable";
import Button from "@/components/ui/Button";
import SearchBar from "@/components/SearchBar";
import { normalizeString } from "@/utils/stringUtils";

import ComponentForm from "./ComponentForm";
import RequisiteForm from "./RequisitesForm";
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
		selector: (row) => (row.type == ComponentType.SUBJECT ? "Disciplina" : "Atividade"),
		sortable: true,
	},
];

export default function CourseEditor() {
	const { id } = useParams();
	const { readComponents } = useComponentService();

	const [search, setSearch] = useState("");
	const [components, setComponents] = useState<IComponent[]>([]);
	const [selectedComponent, setSelectedComponent] = useState<IComponent | null | undefined>();
	const requestComponents = useCallback(async () => {
		setComponents(await readComponents(Number(id)));
	}, [id, readComponents]);

	useEffect(() => {
		void requestComponents();
		setSelectedComponent(undefined);
	}, [requestComponents]);

	return (
		<DashboardContent>
			<div className="title-bar">
				<h1>Listagem de Componentes</h1>
				<div className="actions">
					<Button onClick={() => void 0} category="secondary">
						Visualizar grade
					</Button>
					<Button onClick={() => setSelectedComponent(null)}>Criar</Button>
				</div>
			</div>
			<SearchBar search={search} setSearch={setSearch} placeholder="Pesquise por um Componente..." />
			<DataTable
				columns={columns}
				data={components.filter((c) => normalizeString(c.name).includes(normalizeString(search)))}
				onRowClicked={(e) => setSelectedComponent({ ...e })}
				defaultSortFieldId={1}
			/>
			<hr />
			<ComponentForm
				courseId={Number(id)}
				selectedComponent={selectedComponent}
				refresh={() => {
					void requestComponents();
					setSelectedComponent(undefined);
				}}
			/>
			{selectedComponent && (
				<RequisiteForm
					components={components}
					selectedComponent={selectedComponent}
					refresh={() => {
						void requestComponents();
					}}
				/>
			)}
		</DashboardContent>
	);
}
