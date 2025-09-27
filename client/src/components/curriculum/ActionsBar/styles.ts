import styled from "styled-components";

export const BarContainer = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;

	button {
		border-radius: 100rem;
		font-size: 0.875rem;
		padding: 0.5rem;

		width: 3rem;
		height: 3rem;

		.icon {
			font-size: 1.25rem;
		}
	}
`;
