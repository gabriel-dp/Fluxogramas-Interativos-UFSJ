import { useContext } from "react";

import { NotificationsContext } from "@/contexts/notifications/NotificationsContext";

export default function useNotifications() {
	return useContext(NotificationsContext);
}
