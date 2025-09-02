import useNotifications from "@/contexts/notifications/useNotifications";

import { Notification, NotificationsContainer } from "./styles";

export default function Notifications() {
	const { notifications } = useNotifications();

	return (
		<NotificationsContainer>
			{notifications.map((n) => (
				<Notification key={n.id} $type={n.type}>
					{n.message}
				</Notification>
			))}
		</NotificationsContainer>
	);
}
