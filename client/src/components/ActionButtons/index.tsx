import { FaSlidersH as MainIcon } from "react-icons/fa";

import ButtonTheme from "./ButtonTheme";
import { ButtonsStack, MainButton } from "./styles";

export default function ActionButtons() {
	return (
		<ButtonsStack quantity={1}>
			<MainButton>
				<MainIcon />
			</MainButton>
			<ButtonTheme />
		</ButtonsStack>
	);
}
