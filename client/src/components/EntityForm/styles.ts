import styled from "styled-components";

export const DashboardForm = styled.form`
	padding: 1.25rem;
	border-radius: 0.5rem;
	border: 1px solid ${(props) => props.theme.gray};

	&,
	div {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.row {
		flex-direction: row;
		align-items: center;
	}

	hr {
		border-top: none;
		border-color: ${(props) => props.theme.gray};
	}
`;
