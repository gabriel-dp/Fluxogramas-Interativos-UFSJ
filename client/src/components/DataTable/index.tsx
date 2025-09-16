import { useMemo } from "react";
import { TableProps, Selector, SortOrder } from "react-data-table-component";
import { FaPencilAlt as EditIcon } from "react-icons/fa";

import { normalizeString } from "@/utils/stringUtils";

import { DataTableComponent, NoDataComponent } from "./styles";

interface DataTableProps<T> extends TableProps<T> {
	hideEditIcon?: boolean;
}

function customSort<T>(rows: T[], selector: Selector<T>, direction: SortOrder): T[] {
	return rows.sort((a: T, b: T) => {
		const aField = normalizeString(String(selector(a)));
		const bField = normalizeString(String(selector(b)));

		let comparison = 0;

		if (aField > bField) {
			comparison = 1;
		} else if (aField < bField) {
			comparison = -1;
		}

		return direction === "desc" ? comparison * -1 : comparison;
	});
}

export default function DataTable<T>({ hideEditIcon, ...props }: DataTableProps<T>): JSX.Element {
	const columns = useMemo(() => {
		if (hideEditIcon) return props.columns;

		return [
			...props.columns,
			{
				name: "",
				selector: () => "",
				cell: () => <EditIcon />,
				width: "3rem",
			},
		];
	}, [hideEditIcon, props.columns]);

	return (
		<DataTableComponent
			dense
			responsive
			noDataComponent={<NoDataComponent>Não há registros correspondentes</NoDataComponent>}
			sortFunction={customSort}
			$hideEditIcon={hideEditIcon ? "true" : ""}
			{...props}
			columns={columns}
		/>
	);
}
