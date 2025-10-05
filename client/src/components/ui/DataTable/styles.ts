import styled from "styled-components";
import DataTable from "react-data-table-component";

export const DataTableComponent = styled(DataTable)<any>`
	background-color: ${(props) => props.theme.secondary}66;
	border: 1px solid ${(props) => props.theme.text}33;
	border-radius: 0.5rem;

	* {
		color: ${(props) => props.theme.text};
		background-color: transparent;
	}

	/* Chrome, Edge, Safari (WebKit based) */
	::-webkit-scrollbar {
		background-color: ${(props) => props.theme.secondary}66;
		width: 8px;
		overflow: hidden;
	}
	::-webkit-scrollbar-track {
		background: ${(props) => props.theme.secondary}66;
		border-radius: 100rem;
	}
	::-webkit-scrollbar-thumb {
		background: ${(props) => props.theme.text}66;
		border-radius: 100rem;
	}

	.rdt_TableHead {
		font-weight: bold;
		background-color: ${(props) => props.theme.secondary};
		padding: 0.5rem;
		outline: none;
		border-bottom: 1px solid ${(props) => props.theme.text}33;
	}

	.rdt_TableBody {
		padding: 0.5rem;
	}

	.rdt_TableHeadRow {
		border-bottom: none;
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

	.rdt_TableCell {
		&:last-of-type {
			* {
				pointer-events: none;
			}
		}
	}
`;

export const NoDataComponent = styled.div`
	color: ${(props) => props.theme.text}77;
	padding: 1.25rem;
`;

export const TableWrapper = styled.div`
	max-height: 10rem;
	overflow-y: auto;
`;
