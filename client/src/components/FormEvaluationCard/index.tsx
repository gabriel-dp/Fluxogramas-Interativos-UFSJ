import { useState } from "react";

import useStoredState from "@/hooks/useStoredState";

import { CardContainer } from "./styles";

export default function FormEvaluation() {
	const FORMS_LINK = "https://forms.google.com";

	const [shouldDisplay, setShouldDisplay] = useStoredState("fluxogramas-interativos-evaluation", { display: true });
	const [shouldRender, setShouldRender] = useState(shouldDisplay.display);

	function handlePositive() {
		setShouldDisplay({ display: false });
	}

	function handleNegative() {
		setShouldRender(false);
		setShouldDisplay({ display: false });
	}

	function handleClose() {
		setShouldRender(false);
	}

	if (!shouldRender) return null;
	return (
		<CardContainer>
			<h1 className="title">Avalie o projeto!</h1>
			<p className="description">Leva menos de 1 minuto e faz toda a diferença.</p>
			<button className="close" onClick={handleClose}>
				X
			</button>
			<div className="actions">
				<a className="yes" onClick={handlePositive} href={FORMS_LINK} target="_blank" rel="noopener noreferrer">
					Avaliar
				</a>
				<button className="no" onClick={handleNegative}>
					Não, obrigado
				</button>
			</div>
		</CardContainer>
	);
}
