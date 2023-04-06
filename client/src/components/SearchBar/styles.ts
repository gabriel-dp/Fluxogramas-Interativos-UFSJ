import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

export const SearchContainer = styled.div`
	width: 100%;
	height: 2.5rem;
	border-radius: 0.5rem;
	overflow: hidden;
	position: relative;

	display: flex;
	flex-direction: row;
`;

export const SearchIcon = styled(FaSearch)`
	font-size: 1rem;
	color: ${(props) => props.theme.text}AA;
	pointer-events: none;

	position: absolute;
	top: 50%;
	left: 0.75rem;
	transform: translateY(-50%);
`;

export const SearchInput = styled.input.attrs({
	type: "text",
})`
	height: 100%;
	min-width: 0;
	flex-grow: 1;
	padding: 1rem 1rem 1rem 2.5rem;
	background-color: ${(props) => props.theme.secondary};
	color: ${(props) => props.theme.text};
	border: none;
	outline: none;
	text-overflow: ellipsis;

	::placeholder {
		color: ${(props) => props.theme.text}99;
	}
`;
