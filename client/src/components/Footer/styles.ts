import styled from "styled-components";

export const FooterContainer = styled.div`
	width: 100%;
	padding: 2rem;
	background-color: ${(props) => props.theme.background2};
	color: ${(props) => props.theme.primaryText};

	display: flex;
	justify-content: center;
`;

export const FooterContent = styled.div`
	width: min(100%, 50rem);
	height: 100%;
	opacity: 0.75;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;

	div {
		font-size: 0.75rem;
		text-align: center;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;

		a {
			transition: all ease-in-out 0.25s;
			text-decoration: underline;
			color: inherit;

			:hover {
				font-size: 0.8rem;
			}
		}
	}
`;
