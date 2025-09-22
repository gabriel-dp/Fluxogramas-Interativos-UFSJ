import styled, { keyframes } from "styled-components";

export const MODAL_VISIBLE_TRANSITION_MS: number = 300;

export const ModalsContainer = styled.div<{ $visible: string }>`
	position: fixed;
	inset: 0;
	z-index: 1001;

	display: flex;
	align-items: center;
	justify-content: center;

	pointer-events: ${(p) => (p.$visible == "true" ? "auto" : "none")};
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Backdrop = styled.div<{ $visible: string }>`
	position: absolute;
	inset: 0;

	background-color: ${(props) => props.theme.background}33;
	backdrop-filter: blur(5px);

	opacity: ${(p) => (p.$visible == "true" ? 1 : 0)};
	transition: opacity ${MODAL_VISIBLE_TRANSITION_MS}ms ease;
	animation: ${fadeIn} ${MODAL_VISIBLE_TRANSITION_MS}ms ease;
`;

export const ModalContainer = styled.div`
	max-height: calc(100% - 3rem);

	border-radius: 0.5rem;
	padding: 2rem 1.5rem;
	background-color: ${(props) => props.theme.background};
	border: 1px solid ${(props) => props.theme.text}AA;
	overflow-y: auto;
	position: fixed;
	text-align: center;

	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;
