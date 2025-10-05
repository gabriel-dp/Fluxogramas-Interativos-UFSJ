import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const LoadingSymbol = styled.div`
	border: 0.25rem solid ${(props) => props.theme.secondary}77;
	border-top-color: ${(props) => props.theme.primary};
	border-radius: 50%;
	width: 2rem;
	height: 2rem;
	animation: ${spin} 1s linear infinite;
	margin: 1rem;
`;
