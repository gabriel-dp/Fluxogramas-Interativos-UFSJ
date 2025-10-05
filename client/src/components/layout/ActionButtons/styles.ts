import styled from "styled-components";

export const ButtonsStack = styled.div<{ quantity: number }>`
	width: 3rem;
	min-height: 3rem;
	max-height: 3rem;
	border-radius: 1.5rem;
	overflow-y: hidden;

	position: fixed;
	bottom: 2.25rem;
	right: 1.75rem;
	z-index: 3;

	transition: max-height ease-in-out ${(props) => props.quantity * 0.25}s;

	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	gap: 0.5rem;

	:hover {
		max-height: calc(${(props) => props.quantity} * 3.5rem + 3rem);

		.main {
			filter: drop-shadow(0 0 0.5rem ${(props) => props.theme.text}55);
		}
	}
`;

export const MainButton = styled.button.attrs({
	className: "main",
})`
	width: 100%;
	aspect-ratio: 1;

	border: none;
	border-radius: 100rem;
	padding: 0.75rem;
	background-color: ${(props) => props.theme.primary};

	transition: all ease-in-out 0.25s;

	display: flex;
	justify-content: center;
	align-items: center;

	& {
		color: ${(props) => props.theme.primaryText};
		font-size: 1.25rem;
	}

	:hover {
		background-color: ${(props) => props.theme.primaryHighlight};
	}
`;

export const SecondaryButton = styled.button`
	width: 2.75rem;
	height: 2.75rem;
	aspect-ratio: 1;

	border: none;
	border-radius: 100rem;
	padding: 0.75rem;
	background-color: ${(props) => props.theme.primary};
	cursor: pointer;

	& {
		color: ${(props) => props.theme.primaryText};
		font-size: 1rem;
	}

	:hover {
		background-color: ${(props) => props.theme.primaryHighlight};
	}
`;
