import styled from "styled-components";

export const DashboardContainer = styled.div`
	height: 100dvh;

	display: flex;
	flex-direction: row;
`;

export const DashboardContent = styled.div`
	padding: 3rem clamp(2rem, 5%, 3rem);
	width: 100%;
	flex: 1;

	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	button {
		width: min-content;
	}

	.title-bar {
		width: 100%;

		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;

		h1 {
			flex: 1;
			max-width: 100%;
		}

		.actions {
			max-width: 100%;
			display: flex;
			gap: 1rem;
		}
	}

	hr {
		border: none;
		border-top: 1px solid ${(props) => props.theme.text}33;
	}
`;
