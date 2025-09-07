import { createContext, PropsWithChildren, useState } from "react";
import { v4 as uuid } from "uuid";

export const NOTIFICATION_TIMEOUT_MS = 5000;

interface Notification {
	type: "success" | "warning" | "error";
	message: string;
}

interface NotificationInstance extends Notification {
	id: string;
}

interface NotificationsContextI {
	notifications: NotificationInstance[];
	addNotification: (newNotification: Notification) => void;
}

export const NotificationsContext = createContext<NotificationsContextI>({} as NotificationsContextI);

export function NotificationsProvider(props: PropsWithChildren) {
	const [notifications, setNotifications] = useState<NotificationInstance[]>([]);

	const addNotification = (newNotification: Notification) => {
		const id = uuid();
		setNotifications((prev) => [...prev, { ...newNotification, id }]);
		setTimeout(() => {
			setNotifications((prev) => prev.filter((n) => n.id !== id));
		}, NOTIFICATION_TIMEOUT_MS);
	};

	return (
		<NotificationsContext.Provider value={{ notifications, addNotification }}>
			{props.children}
		</NotificationsContext.Provider>
	);
}
