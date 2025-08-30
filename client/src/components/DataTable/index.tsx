import { TableProps } from "react-data-table-component";

import { DataTableComponent, NoDataComponent } from "./styles";

export default function DataTable<T>(props: TableProps<T>): JSX.Element {
	return (
		<DataTableComponent
			dense
			responsive
			noDataComponent={<NoDataComponent>Não há registros</NoDataComponent>}
			{...props}
		/>
	);
}
