import styled from "styled-components";
import { FaCheck, FaLock, FaLockOpen } from "react-icons/fa";

export const LockIcon = styled(FaLock)`
	color: ${(props) => props.theme.white}55;
`;

export const OpenIcon = styled(FaLockOpen)`
	color: ${(props) => props.theme.black}55;
`;

export const CheckIcon = styled(FaCheck)`
	color: ${(props) => props.theme.white}55;
`;

interface CardProps {
	state: boolean;
	canChange: boolean;
}

export const CardContainer = styled.div.attrs({
	className: "card",
})<CardProps>`
	width: 8rem;
	height: 6.125rem;
	border-radius: 0.5rem;
	padding: 0.75rem;
	user-select: none;
	position: relative;
	text-align: left;

	background-color: ${(props) =>
		props.state ? props.theme.primary : props.canChange ? props.theme.white : props.theme.gray};
	color: ${(props) => (props.state || !props.canChange ? props.theme.primaryText : props.theme.black)};
	cursor: ${(props) => (props.canChange ? "pointer" : "not-allowed")};
	border: 1px solid ${(props) => props.theme.text}33;

	p {
		font-size: 0.75rem;
		max-width: 100%;
		max-height: 100%;
		white-space: break-spaces;
		word-break: break-word;

		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		text-overflow: ellipsis;

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

	.icon {
		font-size: 0.75rem;

		position: absolute;
		bottom: 0.5rem;
		right: 0.5rem;
	}

	.hours {
		font-size: 0.75rem;

		position: absolute;
		bottom: 0.5rem;
		left: 0.75rem;

		.partial {
			color: ${(props) => props.theme.primary};
			font-weight: bold;
		}

		.total {
			opacity: 0.4;
		}
	}
`;
