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

export const ModalContainer = styled.div<{ $noPadding: string }>`
	max-height: calc(100% - 3rem);
	max-width: calc(100% - 2rem);

	border-radius: 0.5rem;
	padding: ${(props) => (props.$noPadding == "true" ? "" : "2rem 1.5rem")};
	background-color: ${(props) => props.theme.background};
	border: 1px solid ${(props) => props.theme.text}55;
	overflow-y: auto;
	position: fixed;
	text-align: center;
	filter: drop-shadow(0 0 0.5rem #00000033);

	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	/* Chrome, Edge, Safari (WebKit based) */
	::-webkit-scrollbar {
		background-color: ${(props) => props.theme.secondary}66;
		width: 8px;
		overflow: hidden;
	}
	::-webkit-scrollbar-track {
		background: ${(props) => props.theme.secondary}66;
		border-radius: 100rem;
	}
	::-webkit-scrollbar-thumb {
		background: ${(props) => props.theme.text}66;
		border-radius: 100rem;
	}

	@media (max-width: 768px) {
		min-width: calc(100% - 2rem);
	}
`;
