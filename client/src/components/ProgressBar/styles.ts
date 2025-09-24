import styled from "styled-components";

export const Track = styled.div`
	width: 100%;
	height: 0.75rem;
	background: ${(props) => props.theme.primaryText};
	border: 1px solid ${(props) => props.theme.primaryText};
	border-radius: 100rem;
	overflow: hidden;
`;

export const Fill = styled.div<{ $percentage: string }>`
	height: 100%;
	width: ${(props) => props.$percentage}%;
	background: ${(props) => props.theme.primary};
	transition: width 300ms ease;
`;
