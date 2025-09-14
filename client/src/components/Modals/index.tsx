import { useEffect, useState } from "react";
import useModal from "@/contexts/modal/useModal";

import { Backdrop, ModalContainer, ModalsContainer, MODAL_VISIBLE_TRANSITION_MS } from "./styles";

export default function Modals() {
	const { modals, closeModal } = useModal();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (modals.length > 0) {
			setVisible(true);
		} else {
			const timeout = setTimeout(() => setVisible(false), MODAL_VISIBLE_TRANSITION_MS);
			return () => clearTimeout(timeout);
		}
	}, [modals.length]);

	if (!visible) return null;

	function handleClickOutside() {
		closeModal(modals[modals.length - 1].id);
	}

	return (
		<ModalsContainer onClick={handleClickOutside} $visible={modals.length > 0 ? "true" : "false"}>
			<Backdrop $visible={modals.length > 0 ? "true" : "false"} />
			{modals.map((m) => (
				<ModalContainer key={m.id} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
					{m.content}
				</ModalContainer>
			))}
		</ModalsContainer>
	);
}
