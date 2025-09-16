import styled from "styled-components";

export const DashboardForm = styled.form`
	padding: 1.25rem;
	border-radius: 0.5rem;
	border: 1px solid ${(props) => props.theme.text}55;

	&,
	div {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.row {
		max-width: 100%;
		flex-direction: row;
		align-items: center;

		@media (max-width: 720px) {
			flex-wrap: wrap;
		}
	}

	hr {
		border-top: none;
		border-color: ${(props) => props.theme.text}55;
	}
`;
