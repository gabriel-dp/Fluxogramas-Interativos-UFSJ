import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableColumn } from "react-data-table-component";

import useComponentService from "@/services/componentService";
import { IComponent } from "@/types/component";
import DataTable from "@/components/DataTable";

import ComponentForm from "./ComponentForm";
import { DashboardContent } from "../styles";
import RequisiteForm from "./RequisitesForm";

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
		selector: (row) => row.type,
		sortable: true,
	},
];

export default function CourseEditor() {
	const { id } = useParams();
	const { readComponents } = useComponentService();

	const [components, setComponents] = useState<IComponent[]>([]);
	const [selectedComponent, setSelectedComponent] = useState<IComponent | null | undefined>();
	const requestComponents = useCallback(async () => {
		setComponents(await readComponents(Number(id)));
	}, [id, readComponents]);

	useEffect(() => {
		void requestComponents();
	}, [requestComponents]);

	return (
		<DashboardContent>
			<DataTable columns={columns} data={components} onRowClicked={(e) => setSelectedComponent({ ...e })} />
			<ComponentForm
				courseId={Number(id)}
				selectedComponent={selectedComponent}
				refresh={() => {
					void requestComponents();
					setSelectedComponent(null);
				}}
			/>
			{selectedComponent && (
				<RequisiteForm
					components={components}
					selectedComponent={selectedComponent}
					refresh={() => void requestComponents()}
				/>
			)}
		</DashboardContent>
	);
}
