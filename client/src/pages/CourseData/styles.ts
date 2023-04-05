import styled from "styled-components";

export const Header = styled.div`
	width: 100%;
	padding: 2rem 1rem;
	background-color: ${(props) => props.theme.background2};
	color: ${(props) => props.theme.primaryText};
	user-select: none;
	text-align: center;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;

	p {
		font-size: 1.25rem;
		font-weight: bold;
	}

	div {
		white-space: nowrap;

		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		column-gap: 1rem;
		row-gap: 0.5rem;
	}
`;

export const CurriculumContainer = styled.div`
	width: 100%;
	padding: 2rem 1rem;
	overflow-x: scroll;

	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 1%;
`;

export const Semester = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
`;
