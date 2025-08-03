import styled from "styled-components";

export const DashboardForm = styled.form`
	padding: 1.25rem;
	border-radius: 0.5rem;
	border: 1px solid gray;

	&,
	div {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.row {
		flex-direction: row;
	}
`;
