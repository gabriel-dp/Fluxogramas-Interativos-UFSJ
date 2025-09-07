import styled from "styled-components";

export const TextComponent = styled.span`
	color: ${(props) => props.theme.primaryText};
	font-size: 0.7rem;
	background-color: ${(props) => props.theme.primary};
	padding: 0.25rem 0.5rem;
	border-radius: 100rem;
	white-space: nowrap;

	max-width: calc(100% - 1rem);
	overflow: hidden;
	text-overflow: ellipsis;

	position: absolute;
	top: 0.75rem;
	right: 0.5rem;
`;
