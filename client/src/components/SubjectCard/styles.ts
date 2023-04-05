import styled from "styled-components";

interface CardProps {
	state: boolean;
	canChange: boolean;
}

export const CardContainer = styled.div<CardProps>`
	width: 8rem;
	aspect-ratio: 1.5;
	border-radius: 0.5rem;
	padding: 0.5rem;
	user-select: none;
	background-color: ${(props) =>
		props.state ? props.theme.primary : props.canChange ? props.theme.white : props.theme.gray};
	color: ${(props) => (props.state ? props.theme.primaryText : props.theme.black)};
	cursor: ${(props) => (props.canChange ? "pointer" : "normal")};

	font-size: 0.8rem;
	white-space: break-spaces;
`;
