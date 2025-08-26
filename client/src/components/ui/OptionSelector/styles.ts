import styled from "styled-components";

export const Wrapper = styled.div`
	width: 100%;

	display: flex;
	flex-direction: column;
	gap: 0.375rem !important;
`;

export const StyledSelect = styled.select<{ $default: boolean }>`
	padding: 0.75rem 0.75rem;
	padding-right: 2.25rem;
	font-size: 1rem;
	border: none;
	border-radius: 0.25rem;
	background-color: ${(props) => props.theme.secondary};
	color: ${(props) => (props.$default ? props.theme.text + "77" : props.theme.text)};
	transition: border-color 0.2s ease;

	&:focus {
		border-color: ${(props) => props.theme.primary};
		outline: none;
	}

	&:disabled {
		background-color: #f5f5f5;
		color: #aaa;
		cursor: not-allowed;
	}

	// arrow style
	appearance: none;
	background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
	background-repeat: no-repeat;
	background-position: right 0.75rem center;
	background-size: 1rem;

	option {
		color: ${(props) => props.theme.text};
		&.default {
			color: ${(props) => props.theme.text}77;
		}
	}
`;

export const StyledLabel = styled.label`
	font-size: 0.75rem;
	margin-left: 0.75rem;
	color: ${(props) => props.theme.text};
	pointer-events: none;

	max-width: calc(100% - 1.5rem);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;
