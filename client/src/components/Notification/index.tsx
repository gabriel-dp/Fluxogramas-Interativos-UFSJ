import { FaCheck as SuccessIcon, FaExclamationTriangle as WarningIcon, FaCross as ErrorIcon } from "react-icons/fa";

import useNotifications from "@/contexts/notifications/useNotifications";

import { Notification, NotificationsContainer } from "./styles";

export default function Notifications() {
	const { notifications } = useNotifications();

	return (
		<NotificationsContainer>
			{notifications.map((n) => {
				let icon = null;
				if (n.type === "success") icon = <SuccessIcon className="icon" />;
				else if (n.type === "warning") icon = <WarningIcon className="icon" />;
				else if (n.type === "error") icon = <ErrorIcon className="icon" />;
				return (
					<Notification key={n.id} $type={n.type}>
						{icon} {n.message}
					</Notification>
				);
			})}
		</NotificationsContainer>
	);
}
