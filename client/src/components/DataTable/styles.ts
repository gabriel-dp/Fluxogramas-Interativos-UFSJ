import styled from "styled-components";
import DataTable from "react-data-table-component";

export const DataTableComponent = styled(DataTable)<any>`
	background-color: ${(props) => props.theme.text}11;
	border: 1px solid ${(props) => props.theme.text}33;
	padding: 1rem;
	border-radius: 0.5rem;

	* {
		color: ${(props) => props.theme.text};
		background-color: transparent;
	}

	.rdt_TableHead {
		font-weight: bold;
	}

	.rdt_TableHeadRow {
		border-bottom: 1px solid ${(props) => props.theme.text}33;
	}

	.rdt_TableRow {
		cursor: pointer;
		:hover {
			background-color: ${(props) => props.theme.primary}66;
		}

		&:not(:last-of-type) {
			border-bottom: 1px solid ${(props) => props.theme.text}33;
		}
	}
`;
