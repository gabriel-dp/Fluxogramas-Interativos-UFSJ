import { createContext, PropsWithChildren, ReactNode, useState } from "react";
import { v4 as uuid } from "uuid";

interface Modal {
	content: ReactNode;
}

interface ModalInstance extends Modal {
	id: string;
}

type ModalContextI = {
	modals: ModalInstance[];
	openModal: (newModal: Modal) => string;
	closeModal: (id: string) => void;
};

export const ModalContext = createContext<ModalContextI>({} as ModalContextI);

export function ModalProvider(props: PropsWithChildren) {
	const [modals, setModals] = useState<ModalInstance[]>([]);

	const openModal = (newModal: Modal) => {
		const id = uuid();
		setModals((prev) => [...prev, { ...newModal, id }]);
		return id;
	};

	const closeModal = (id: string) => {
		setModals((prev) => prev.filter((m) => m.id !== id));
	};

	return <ModalContext.Provider value={{ modals, openModal, closeModal }}>{props.children}</ModalContext.Provider>;
}
