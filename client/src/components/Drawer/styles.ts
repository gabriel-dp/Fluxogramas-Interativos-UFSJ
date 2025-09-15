import styled from "styled-components";

interface DrawerProps {
	open: boolean;
}

const DRAWER_CONTENT_WIDTH_REM = 20;

export const DrawerContainer = styled.div<DrawerProps>`
	height: 100dvh;
	background-color: ${(props) => props.theme.background2};
	color: ${(props) => props.theme.text};

	width: ${DRAWER_CONTENT_WIDTH_REM}rem;
	transition: all 0.3s ease-in-out;
	z-index: 1000;
	position: sticky;
	top: 0;

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
	padding: min(2rem, 50%) 0;

	box-sizing: border-box;
	max-height: 100%;
	overflow-x: hidden;
	overflow-y: auto;

	.drawer-group {
		.drawer-title {
			margin: 1rem 1.25rem;
			margin-bottom: 0.5rem;
			max-width: 100%;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			user-select: none;
		}

		ul {
			list-style: none;

			li {
				max-width: 100%;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				padding: 0.75rem 1.75rem;
				cursor: pointer;
				transition: all 0.125s ease-in-out;

				:hover {
					background-color: ${(props) => props.theme.primary}44;
				}

				.icon {
					margin-right: 0.5rem;
					transform: translateY(0.125rem);
				}
			}
		}
	}

	img {
		margin: 1.5rem;
		margin-top: 0;
		max-width: 20rem;
		cursor: pointer;
	}

	hr {
		width: calc(100% - 2.5rem);
		border: none;
		border-bottom: 1px solid ${(props) => props.theme.text}33;
		margin: 0.5rem auto;
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
