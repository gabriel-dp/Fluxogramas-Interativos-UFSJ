import styled from "styled-components";

export const RequisitesList = styled.ul`
	list-style: none;

	display: "flex";
	flex-direction: "column";

	li,
	p {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	button {
		min-width: 2.5rem;
		padding: 0.5rem;
		font-size: 1rem;
		border: none;

		&:hover {
			color: ${(props) => props.theme.primary};
		}

		.icon {
			transform: translateY(0.12rem);
		}
	}

	.empty {
		opacity: 0.5;
	}
`;

export const AddRequisiteRow = styled.div`
	display: flex;
	row-gap: 2rem;
	align-items: flex-end !important;

	> div {
		width: min(40rem, 100%);
	}

	label {
		flex: 1;
		white-space: nowrap;
	}

	button {
		min-width: 25%;
	}
`;
