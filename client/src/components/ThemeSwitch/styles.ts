import styled from "styled-components";

export const ThemeButton = styled.button`
	border: none;
	border-radius: 100rem;
	padding: 0.75rem;
	background-color: ${(props) => props.theme.primary};
	transition: all 0.25s ease;

	display: flex;
	justify-content: center;
	align-items: center;

	position: fixed;
	bottom: 1.5rem;
	right: 1.5rem;
	z-index: 2;

	.icon {
		font-size: 1rem;
		color: ${(props) => props.theme.primaryText};
	}

	:hover {
		background-color: ${(props) => props.theme.primaryText};
		.icon {
			color: ${(props) => props.theme.primary};
		}
	}
`;
