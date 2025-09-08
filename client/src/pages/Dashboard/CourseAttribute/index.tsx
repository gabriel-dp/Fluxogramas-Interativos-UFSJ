import { useCallback, useEffect, useState } from "react";
import { TableColumn } from "react-data-table-component";

import { IAttribute } from "@/types/course-attributes";
import DataTable from "@/components/DataTable";
import Button from "@/components/ui/Button";
import useCourseTypeService from "@/services/courseTypeService";

import AttributeForm from "./AttributeForm";
import { DashboardContent } from "../styles";

const columns: TableColumn<IAttribute>[] = [
	{
		name: "Id",
		selector: (row) => row.id,
		sortable: true,
	},
	{
		name: "Nome",
		selector: (row) => row.name,
		sortable: true,
	},
];

interface AttributesListProps {
	entity: string;
	service: ReturnType<typeof useCourseTypeService>;
}

export default function AttributesList(props: AttributesListProps) {
	const [attributes, setAttributes] = useState<IAttribute[]>([]);
	const [selectedAttribute, setSelectedAttribute] = useState<IAttribute | null | undefined>();

	const { readAll: readAllAttributes } = props.service;

	const requestAttributes = useCallback(async () => {
		setAttributes(await readAllAttributes());
		setSelectedAttribute(undefined);
	}, [readAllAttributes]);

	useEffect(() => {
		void requestAttributes();
	}, [requestAttributes, props.service]);

	return (
		<DashboardContent>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<h1>Listagem de {props.entity}</h1>
				<Button onClick={() => setSelectedAttribute(null)}>Criar</Button>
			</div>
			<DataTable
				columns={columns}
				data={attributes}
				onRowClicked={(e) => setSelectedAttribute({ ...e })}
				defaultSortFieldId={1}
			/>
			<AttributeForm
				entity={props.entity}
				service={props.service}
				selectedAttribute={selectedAttribute}
				refresh={() => void requestAttributes()}
			/>
		</DashboardContent>
	);
}
