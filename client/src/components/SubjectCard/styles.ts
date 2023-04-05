import styled from "styled-components";

interface CardProps {
	state: boolean;
	canChange: boolean;
}

export const CardContainer = styled.div<CardProps>`
	width: 8rem;
	aspect-ratio: 1.5;
	background-color: ${(props) =>
		props.state ? props.theme.primary : props.canChange ? props.theme.white : props.theme.gray};
	color: ${(props) => (props.state ? props.theme.primaryText : props.theme.black)};
	border-radius: 0.5rem;
	padding: 0.5rem;
`;
