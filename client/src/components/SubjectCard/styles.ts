import styled from "styled-components";

export const CardContainer = styled.div`
	width: 8rem;
	aspect-ratio: 1.5;
	background-color: ${(props) => props.theme.primary};
	border-radius: 0.5rem;
	padding: 0.5rem;
`;
