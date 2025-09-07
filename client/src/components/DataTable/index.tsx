import { useEffect } from "react";
import { TableProps } from "react-data-table-component";
import { FaPencilAlt as EditIcon } from "react-icons/fa";

import { DataTableComponent, NoDataComponent } from "./styles";

interface DataTableProps<T> extends TableProps<T> {
	hideEditIcon?: boolean;
}

export default function DataTable<T>({ hideEditIcon, ...props }: DataTableProps<T>): JSX.Element {
	useEffect(() => {
		if (!hideEditIcon) {
			props.columns.push({
				name: "",
				selector: () => "",
				cell: () => <EditIcon />,
				width: "4rem",
			});
		}
	}, [hideEditIcon, props.columns]);

	return (
		<DataTableComponent
			dense
			responsive
			noDataComponent={<NoDataComponent>Não há registros</NoDataComponent>}
			$hideEditIcon={hideEditIcon ? "true" : ""}
			{...props}
		/>
	);
}
