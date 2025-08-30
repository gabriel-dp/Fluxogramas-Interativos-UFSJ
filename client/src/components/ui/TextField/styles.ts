import styled, { css } from "styled-components";

export const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

export const InputWrapper = styled.div`
	position: relative;
	padding-top: 1.25rem;
`;

export const StyledInput = styled.input`
	width: 100%;
	padding: 0.75rem;
	font-size: 1rem;
	border: 1px solid ${(props) => props.theme.text}44;
	border-radius: 0.25rem;
	outline: none;
	background-color: ${(props) => props.theme.secondary};
	color: ${(props) => props.theme.text};

	&:focus {
		border-color: ${(props) => props.theme.text};
	}
`;

export const StyledLabel = styled.label<{ isFloating: boolean }>`
	position: absolute;
	left: 0.75rem;
	top: 1.875rem;
	color: #aaa;
	font-size: 1rem;
	transition: all 0.2s ease-out;
	pointer-events: none;

	max-width: calc(100% - 1.5rem);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	${({ isFloating }) =>
		isFloating &&
		css`
			top: 0;
			font-size: 0.75rem;
			color: ${(props) => props.theme.text};
		`}
`;
