import { useContext } from "react";

import { ModalContext } from "@/contexts/modal/ModalContext";

export default function useNotifications() {
	return useContext(ModalContext);
}
