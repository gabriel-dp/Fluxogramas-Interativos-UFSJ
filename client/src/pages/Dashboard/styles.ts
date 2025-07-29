import styled from "styled-components";

export const DashboardContainer = styled.div`
	height: 100dvh;

	display: flex;
	flex-direction: row;
`;

export const DashboardContent = styled.div`
	padding: 3rem;
	flex: 1;

	display: flex;
	flex-direction: column;
	gap: 1.5rem;

	button {
		width: min-content;
	}
`;

export const DashboardFormContainer = styled.div``;

export const DashboardForm = styled.form`
	padding: 1.25rem;
	border-radius: 0.5rem;
	border: 1px solid gray;

	display: flex;
	flex-direction: column;
	gap: 1rem;

	div {
		display: flex;
		gap: 1rem;
	}
`;
