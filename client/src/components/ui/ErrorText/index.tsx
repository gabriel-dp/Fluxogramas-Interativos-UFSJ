import { FaExclamationTriangle as AttentionIcon } from "react-icons/fa";

import { TextComponent } from "./styles";

interface ErrorTextProps {
	error: string | undefined;
}

export default function ErrorText(props: ErrorTextProps) {
	if (!props.error) return null;
	return (
		<TextComponent>
			<AttentionIcon /> {props.error}
		</TextComponent>
	);
}
