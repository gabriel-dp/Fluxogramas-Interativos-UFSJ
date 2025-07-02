import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;

export const CardContainer = styled.div`
	width: min(23rem, 100% - 2rem);
	min-height: 12rem;
	padding: 1.5rem;
	border-radius: 0.5rem;

	background: ${(props) => props.theme.white}99;
	border-radius: 16px;
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(5px);
	border: 1px solid rgba(255, 255, 255, 0.5);
	filter: drop-shadow(0 0 0.5rem #00000033);

	&,
	* {
		color: ${(props) => props.theme.black};
	}

	position: fixed;
	bottom: 1rem;
	left: 1rem;
	z-index: 1000;

	display: flex;
	flex-direction: column;
	gap: 1rem;

	.title {
		font-size: 1.5rem;
		padding-right: 1.5rem;
	}

	.description {
		flex-grow: 1;
	}

	.close {
		position: fixed;
		top: 1rem;
		right: 1rem;
		padding: 0.75rem;
		border-radius: 100rem;
		border: none;
		background-color: transparent;
		cursor: pointer;
	}

	.actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;

		* {
			appearance: none;
			cursor: pointer;
			padding: 0.5rem 1rem;
			border: none;
			border-radius: 0.25rem;
			flex: 1;
		}

		.yes {
			background-color: ${(props) => props.theme.primary};
			color: ${(props) => props.theme.primaryText};
			font-size: 1rem;
			padding: 0.625rem 1rem;
			text-align: center;
			text-decoration: none;

			animation: ${pulse} 1.5s infinite;
		}

		.no {
			background-color: transparent;
			text-decoration: underline;
		}
	}
`;
