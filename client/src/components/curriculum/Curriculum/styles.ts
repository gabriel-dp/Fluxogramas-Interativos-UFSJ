import styled from "styled-components";

export const CurriculumWrapper = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 100%;
`;

export const SemestersList = styled.div`
	display: flex;
	flex-direction: row;
	gap: 1rem;
	overflow: auto;
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

export const Semester = styled.div<{ $finished: string }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	white-space: nowrap;
	color: ${(props) => props.theme.text}AA;

	.semester-title {
		font-weight: bold;
		user-select: none;
		cursor: pointer;
		text-decoration: ${(props) => (props.$finished == "true" ? "line-through" : "normal")};

		:hover {
			color: ${(props) => props.theme.primary};
		}
	}
`;

export const ActivitiesList = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 1rem;
	padding: 1rem;

	.card {
		width: min(100%, 11rem) !important;
	}
`;

export const ProgressBarContainer = styled.div`
	padding: 1rem;
	padding-top: 1.5rem;
	position: sticky;
	bottom: 0;

	display: flex;
	flex-direction: row;
	gap: 1rem;
	align-items: center;

	.percentage {
		width: 3rem;
		text-align: right;
		font-size: 0.875rem;
	}

	&::before {
		content: "";
		position: absolute;
		inset: 0;
		background-color: ${(props) => props.theme.background};
		mask-image: linear-gradient(to bottom, transparent, black 66%);
		z-index: -1;
		transition: all 0.25s ease;
	}
`;

export const FocusOverflow = styled.div<{ $on: string; $interact: string }>`
	position: fixed;
	inset: 0;
	display: ${(props) => (props.$on == "true" ? "block" : "none")};
	pointer-events: ${(props) => (props.$interact == "true" ? "none" : "auto")};
	z-index: 2;
`;
