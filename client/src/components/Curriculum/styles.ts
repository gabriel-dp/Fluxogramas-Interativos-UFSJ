import styled from "styled-components";

export const CurriculumList = styled.div`
	display: flex;
	flex-direction: row;
	gap: 1rem;
	overflow: auto;
	border: 1px solid red;
	padding: 1rem;
	overflow-x: auto;

	/* Reverse Scrollbar */
	transform: rotateX(180deg);
	& > * {
		transform: rotateX(180deg);
	}

	/* For Webkit based browsers */
	::-webkit-scrollbar {
		height: 0.8rem;
	}
	::-webkit-scrollbar-track {
		background-color: ${(props) => props.theme.white}CC;
		border-radius: 0.8rem;
	}
	::-webkit-scrollbar-thumb {
		background-color: ${(props) => props.theme.primary};
		border-radius: 0.8rem;
		border: 1px solid ${(props) => props.theme.white}CC;
	}
	::-webkit-scrollbar-button {
		width: 0.5rem;
		display: block;
	}

	/* For Firefox */
	scrollbar-width: 0.5rem;
	scrollbar-color: ${(props) => props.theme.primary} ${(props) => props.theme.white}CC;
`;

export const Semester = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	white-space: nowrap;

	.semester-title {
		font-weight: bold;
		user-select: none;
	}
`;
