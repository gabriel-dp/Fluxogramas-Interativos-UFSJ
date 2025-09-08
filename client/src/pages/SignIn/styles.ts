import styled from "styled-components";

export const SignInFormContainer = styled.form`
	height: 100%;
	width: min(23rem, 100%);
	margin: 1rem auto;
	padding: 2rem 1.5rem;
	// border: 1px solid ${(props) => props.theme.background2};
	// border-radius: 0.5rem;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;

	.fields,
	.actions {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.actions {
		margin-top: 1.25rem;

		button {
			width: clamp(2rem, 75%, 100%);
		}
	}

	.error {
		background: ${(props) => props.theme.white}EE;
		color: ${(props) => props.theme.primary};
		border: 1px solid #00000033;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		user-select: none;

		.icon {
			margin-right: 0.5rem;
			transform: translateY(0.125rem);
		}
	}
`;

export const SignInFormTitle = styled.h1`
	font-size: 1.75rem;
	margin-bottom: 0.5rem;
`;

export const LogoImage = styled.img`
	width: min(20rem, 80%);
`;
