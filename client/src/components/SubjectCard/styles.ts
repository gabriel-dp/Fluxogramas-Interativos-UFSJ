import styled from "styled-components";
import { FaCheck, FaLock, FaLockOpen } from "react-icons/fa";

export const LockIcon = styled(FaLock)`
	color: ${(props) => props.theme.white}55;
	font-size: 0.85rem;

	position: absolute;
	bottom: 0;
	right: 0;
	transform: translate(-50%, -50%);
`;

export const OpenIcon = styled(FaLockOpen)`
	color: ${(props) => props.theme.black}55;
	font-size: 0.85rem;

	position: absolute;
	bottom: 0;
	right: 0;
	transform: translate(-50%, -50%);
`;

export const CheckIcon = styled(FaCheck)`
	color: ${(props) => props.theme.white}55;
	font-size: 0.85rem;

	position: absolute;
	bottom: 0;
	right: 0;
	transform: translate(-50%, -50%);
`;

interface CardProps {
	state: boolean;
	canChange: boolean;
}

export const CardContainer = styled.div<CardProps>`
	width: 8rem;
	aspect-ratio: 1.5;
	border-radius: 0.5rem;
	padding: 0.75rem;
	user-select: none;
	position: relative;

	background-color: ${(props) =>
		props.state ? props.theme.primary : props.canChange ? props.theme.white : props.theme.gray};
	color: ${(props) => (props.state || !props.canChange ? props.theme.primaryText : props.theme.black)};
	cursor: ${(props) => (props.canChange ? "pointer" : "normal")};

	p {
		font-size: 0.75rem;
		white-space: break-spaces;

		&.name {
			text-decoration: ${(props) => (props.state ? "line-through" : "none")};
		}
	}

	transition: all 0.25s ease-out;
	:hover {
		filter: drop-shadow(
			0 0 0.25rem ${(props) => (props.state || props.canChange ? props.theme.primary : "transparent")}
		);
	}
`;
