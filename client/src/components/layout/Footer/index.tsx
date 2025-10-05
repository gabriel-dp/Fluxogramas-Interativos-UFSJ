import { FooterContainer, FooterContent } from "./styles";

export default function Footer() {
	return (
		<FooterContainer>
			<FooterContent>
				<div>
					<p>Este projeto é independente, não possuindo vínculo formal com a UFSJ</p>
					<p>
						Caso haja informações erradas, entre em contato via <a href="mailto:gabriel.meira.2004@gmail.com">email</a>
					</p>
				</div>
				<a
					className="evaluation"
					onClick={() => 0}
					href="https://forms.gle/nnmqozewNsN1cMVq7"
					target="_blank"
					rel="noopener noreferrer"
				>
					Avalie a ferramenta!
				</a>
				<div>
					<p>
						<a href="https://github.com/gabriel-dp/Fluxogramas-Interativos-UFSJ">Ver código-fonte do projeto</a>
					</p>
					<p>Made by Gabriel de Paula</p>
				</div>
			</FooterContent>
		</FooterContainer>
	);
}
