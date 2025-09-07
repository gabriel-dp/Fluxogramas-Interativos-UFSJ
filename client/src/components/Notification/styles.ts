import styled, { keyframes } from "styled-components";

import { NOTIFICATION_TIMEOUT_MS } from "@/contexts/notifications/NotificationsContext";

export const NotificationsContainer = styled.div`
	position: fixed;
	bottom: 1.5rem;
	left: 1.5rem;
	z-index: 1001;

	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

const slideAnimation = keyframes`
    0% { 
        transform: translateX(calc(-100% - 1.5rem)); 
        max-height: 0;
        margin-bottom: 0;
        padding: 0;
    }
    10% {
        transform: translateX(calc(-100% - 1.5rem)); 
        max-height: 5rem; 
        margin-bottom: 0.5rem;
        	padding: 1rem 1.5rem;
    }
    20% { 
        transform: translateX(0); 
        max-height: 5rem; 
        margin-bottom: 0.5rem;
        padding: 1rem 1.5rem;
    }
    80% { 
        transform: translateX(0); 
        max-height: 5rem;  
        margin-bottom: 0.5rem;
       	padding: 1rem 1.5rem;
    }
    90% {
        transform: translateX(calc(-100% - 1.5rem));
        max-height: 5rem;  
        margin-bottom: 0.5rem;
        	padding: 1rem 1.5rem;
    }
    100% { 
        transform: translateX(calc(-100% - 1.5rem));
        max-height: 0;
        margin-bottom: 0;
        padding: 0;
    }
`;

export const Notification = styled.div<{ $type: "success" | "warning" | "error" }>`
	border-radius: 0.25rem;
	transition: 1s all ease-in-out;

	width: min-content;
	white-space: nowrap;

	background: ${(props) => props.theme.white}CC;
	color: ${(props) => props.theme.black};
	border-radius: 16px;
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(5px);
	border: 1px solid rgba(255, 255, 255, 0.5);
	filter: drop-shadow(0 0 0.5rem #00000033);

	animation-name: ${slideAnimation};
	animation-duration: ${NOTIFICATION_TIMEOUT_MS}ms;
	animation-iteration-count: initial;

	.icon {
		font-size: 1rem;
		margin-right: 0.5rem;
		transform: translateY(0.125rem);

		color: ${({ $type }) => ($type === "success" ? "green" : $type === "warning" ? "orange" : "red")};
	}
`;
