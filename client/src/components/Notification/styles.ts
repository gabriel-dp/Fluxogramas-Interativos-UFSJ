import styled, { keyframes } from "styled-components";

import { NOTIFICATION_TIMEOUT_MS } from "@/contexts/notifications/NotificationsContext";

export const NotificationsContainer = styled.div`
	position: fixed;
	top: 1.5rem;
	right: 1.5rem;
	z-index: 2;

	display: flex;
	flex-direction: column;
`;

const slideAnimation = keyframes`
    0% { 
        transform: translateX(calc(100% + 1.5rem)); 
        max-height: 0;
        margin-bottom: 0;
    }
    10% {
        transform: translateX(calc(100% + 1.5rem)); 
        max-height: 3rem; 
        margin-bottom: 0.5rem;
    }
    20% { 
        transform: translateX(0); 
        max-height: 3rem; 
        margin-bottom: 0.5rem;
    }
    80% { 
        transform: translateX(0); 
        max-height: 3rem;  
        margin-bottom: 0.5rem;
    }
    90% {
        transform: translateX(calc(100% + 1.5rem));
        max-height: 3rem;  
        margin-bottom: 0.5rem;
    }
    100% { 
        transform: translateX(calc(100% + 1.5rem));
        max-height: 0;
        margin-bottom: 0;
    }
`;

export const Notification = styled.div<{ $type: "success" | "warning" | "error" }>`
	padding: 1rem;
	border-radius: 0.25rem;
	background-color: black;
	transition: 1s all ease-in-out;
	height: 3rem;

	animation-name: ${slideAnimation};
	animation-duration: ${NOTIFICATION_TIMEOUT_MS}ms;
	animation-iteration-count: initial;
`;
