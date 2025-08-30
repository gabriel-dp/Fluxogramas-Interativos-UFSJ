import styled, { css } from "styled-components";

import { ButtonCategory } from ".";

const categoryStyles = {
	primary: css`
		background-color: ${(props) => props.theme.primary};
		color: ${(props) => props.theme.primaryText};
		border: none;

		&:hover {
			background-color: ${(props) => props.theme.primaryHighlight};
		}
	`,
	secondary: css`
		background-color: transparent;
		color: ${(props) => props.theme.text};
		border: 1px solid ${(props) => props.theme.text}77;

		&:hover {
			background-color: ${(props) => props.theme.primary}44;
		}
	`,
};

export const StyledButton = styled.button<{ $category: ButtonCategory }>`
	padding: 0.75rem 1.5rem;
	font-size: 1rem;
	border-radius: 0.25rem;
	cursor: pointer;
	transition:
		background-color 0.2s ease,
		color 0.2s ease;

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	${({ $category }) => categoryStyles[$category]}
`;
