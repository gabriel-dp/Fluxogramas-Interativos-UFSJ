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

		.corequisite {
			font-weight: bold;
		}
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
	width: 100%;

	> div {
		min-width: min(100%, 15rem);
		flex: 1;
	}

	label {
		white-space: nowrap;
	}

	button {
		width: min(100%, 10rem);
		min-width: min(100%, 10rem);
	}
`;

export const CurriculumModal = styled.div`
	max-width: min(calc(100dvw - 6rem), 100rem);
	padding: 1rem 2rem;
	zoom: 0.875;
`;
