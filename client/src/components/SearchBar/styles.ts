import styled from "styled-components";

export const SearchContainer = styled.div`
	width: 100%;
	height: 2.5rem;
	border-radius: 0.5rem;
	overflow: hidden;

	display: flex;
	flex-direction: row;
`;

export const SearchInput = styled.input.attrs({
	type: "text",
})`
	height: 100%;
	min-width: 0;
	flex-grow: 1;
	padding: 0 1rem;
	background-color: ${(props) => props.theme.secondary};
	color: ${(props) => props.theme.text};
	border: none;
	outline: none;
	text-overflow: ellipsis;

	::placeholder {
		color: ${(props) => props.theme.text}99;
	}
`;
