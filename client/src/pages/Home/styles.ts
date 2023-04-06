import styled from "styled-components";

export const Screen = styled.div`
	width: 100%;
	min-height: 100dvh;

	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const HomeContainer = styled.div`
	width: min(100%, 40rem);
	padding: 2rem 1rem;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2rem;
`;

export const CoursesContainer = styled.div`
	width: 100%;

	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

export const CourseElement = styled.div`
	width: 100%;
	padding: 1rem 1.5rem;
	border-radius: 0.5rem;
	background: ${(props) => props.theme.secondary};
	overflow: hidden;
	user-select: none;
	cursor: pointer;

	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 1rem;

	.course-name {
		text-align: center;
	}

	.course-data {
		flex-grow: 1;
		font-size: 0.8rem;

		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	transition: all 0.3s ease-out;

	:hover {
		background: ${(props) => props.theme.primary};
		color: ${(props) => props.theme.primaryText};
	}
`;
