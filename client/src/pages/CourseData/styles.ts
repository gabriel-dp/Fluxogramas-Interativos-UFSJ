import styled from "styled-components";

export const Screen = styled.main`
	width: 100%;
	min-height: 100dvh;

	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const Header = styled.div`
	width: 100%;
	padding: 2rem 1rem;
	background-color: ${(props) => props.theme.background2};
	color: ${(props) => props.theme.primaryText};
	text-align: center;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;

	p {
		font-size: 1.25rem;
		font-weight: bold;
	}

	div {
		span {
			white-space: nowrap;
			display: inline-block;
			.icon {
				transition: transform 0.5s;
				transform: rotate(0deg) translateY(15%);
				:hover {
					transform: rotate(360deg) translateY(10%);
				}
			}
		}

		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		column-gap: 1.5rem;
		row-gap: 0.5rem;
	}
`;

interface CurriculumProps {
	hasData: boolean;
}

export const CurriculumContainer = styled.div<CurriculumProps>`
	max-width: 100%;
	flex-grow: 1;
	margin: auto;
	padding: 2rem 1rem 1rem 1rem;
	margin-top: 1rem;

	/* Scrollbar control */
	overflow-x: ${(props) => (props.hasData ? "scroll" : "normal")};
	transform: rotateX(${(props) => (props.hasData ? "180deg" : "0deg")});
	.curriculum {
		transform: rotateX(180deg);
	}

	/* For Webkit based browsers */
	::-webkit-scrollbar {
		height: 0.8rem;
	}
	::-webkit-scrollbar-track {
		background-color: ${(props) => props.theme.white};
		border-radius: 0.8rem;
	}
	::-webkit-scrollbar-thumb {
		background-color: ${(props) => props.theme.primary};
		border-radius: 0.8rem;
		border: 1px solid ${(props) => props.theme.white};
	}
	::-webkit-scrollbar-button {
		width: 0.5rem;
		display: block;
	}

	/* For Firefox */
	scrollbar-width: 0.5rem;
	scrollbar-color: ${(props) => props.theme.primary} ${(props) => props.theme.white};
`;
