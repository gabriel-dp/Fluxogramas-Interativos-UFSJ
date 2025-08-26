import styled from "styled-components";

interface DrawerProps {
	open: boolean;
}

const DRAWER_CONTENT_WIDTH_REM = 20;

export const DrawerContainer = styled.div<DrawerProps>`
	height: 100dvh;
	background-color: ${(props) => props.theme.background2};
	color: ${(props) => props.theme.white};

	width: ${DRAWER_CONTENT_WIDTH_REM}rem;
	transition: all 0.3s ease-in-out;
	z-index: 1000;

	@media (max-width: 1080px) {
		transform: translateX(${(props) => (props.open ? 0 : "-100%")});
		width: min(100%, ${({ open }) => (open ? DRAWER_CONTENT_WIDTH_REM : 0)}rem);
		position: fixed;
		top: 0;
		left: 0;
	}

	@media (max-width: 720px) {
		width: 100%;

		${({ open }) =>
			open
				? "\
				.control-button { \
					transform: rotate(180deg);\
					left: auto;\
					right: 0;\
				}\
				"
				: ""}
	}
`;

export const DrawerContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: min(2rem, 50%);

	box-sizing: border-box;
	overflow: hidden;

	.drawer-group {
		.drawer-title {
			margin-bottom: 0.5rem;
			max-width: 100%;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}

		ul {
			list-style: none;

			li {
				max-width: 100%;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				padding: 0.5rem;
				border-radius: 0.5rem;
				cursor: pointer;

				:hover {
					background-color: ${(props) => props.theme.gray}AA;
				}
			}
		}
	}

	hr {
		width: 100%;
		border-top: none;
		border-bottom: 1px solid ${(props) => props.theme.gray};
		margin: 0.5rem 0;
	}

	button {
		margin-bottom: 1rem;
	}
`;

export const ToggleButton = styled.button.attrs({ className: "control-button" })`
	padding: 0.75rem 0.75rem 0.75rem 0.5rem;
	border-radius: 0 1rem 1rem 0;
	background-color: ${(props) => props.theme.primary};
	color: ${(props) => props.theme.primaryText};
	border: none;
	outline: none;
	font-size: 1.25rem;
	cursor: pointer;

	display: flex;
	align-items: center;
	justify-content: center;

	position: fixed;
	top: 50%;
	left: 100%;
	z-index: 1100;

	@media (min-width: 1081px) {
		display: none;
	}
`;

export const LogoImage = styled.img`
	width: min(25rem, 80%);
`;
