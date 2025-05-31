import { TableProps } from "react-data-table-component";

import { DataTableComponent } from "./styles";

export default function DataTable<T>(props: TableProps<T>): JSX.Element {
	return <DataTableComponent dense {...props} />;
}
