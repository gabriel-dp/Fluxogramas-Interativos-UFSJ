import { useEffect, useState } from "react";

import useStoredState from "@/hooks/useStoredState";

import { CardContainer } from "./styles";

export default function FormEvaluation() {
	const FORMS_LINK = "https://forms.gle/nnmqozewNsN1cMVq7";

	const [evaluation, setEvaluation] = useStoredState("fluxogramas-interativos-evaluation", {
		display: true,
		firstAccess: true,
	});
	const [shouldRender, setShouldRender] = useState(evaluation.display && !evaluation.firstAccess);

	useEffect(() => {
		const timer = setTimeout(() => {
			setEvaluation((state) => {
				setShouldRender(state.display);
				return { ...state, firstAccess: false };
			});
		}, 5 * 1000);

		return () => clearTimeout(timer);
	}, [setEvaluation]);

	function handlePositive() {
		setEvaluation((state) => ({ ...state, display: false }));
	}

	function handleNegative() {
		setShouldRender(false);
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
					Agora não
				</button>
			</div>
		</CardContainer>
	);
}
