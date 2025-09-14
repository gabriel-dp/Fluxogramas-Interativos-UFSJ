import { useCallback, useEffect, useState } from "react";
import { TableColumn } from "react-data-table-component";

import { IAttribute } from "@/types/course-attributes";
import DataTable from "@/components/DataTable";
import Button from "@/components/ui/Button";
import useCourseTypeService from "@/services/courseTypeService";
import SearchBar from "@/components/SearchBar";
import { normalizeString } from "@/utils/stringUtils";

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
	const [search, setSearch] = useState("");
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
			<div className="title-bar">
				<h1>Listagem de {props.entity}</h1>
				<div className="actions">
					<Button onClick={() => setSelectedAttribute(null)}>Criar</Button>
				</div>
			</div>
			<SearchBar search={search} setSearch={setSearch} placeholder={`Pesquise por um ${props.entity}...`} />
			<DataTable
				columns={columns}
				data={attributes.filter((a) => normalizeString(a.name).includes(normalizeString(search)))}
				onRowClicked={(e) => setSelectedAttribute({ ...e })}
				defaultSortFieldId={1}
			/>
			<hr />
			<AttributeForm
				entity={props.entity}
				service={props.service}
				selectedAttribute={selectedAttribute}
				refresh={() => void requestAttributes()}
			/>
		</DashboardContent>
	);
}
