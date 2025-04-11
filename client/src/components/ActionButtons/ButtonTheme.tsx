import { FaSun as LightIcon, FaMoon as DarkIcon } from "react-icons/fa";

import useTheme from "@/contexts/theme/useTheme";
import useConfigs from "@/contexts/configs/useConfigs";

import { SecondaryButton } from "./styles";

export default function ButtonTheme() {
	const theme = useTheme();
	const { toggleTheme } = useConfigs();

	return (
		<SecondaryButton onClick={() => toggleTheme()} aria-label="theme-switcher">
			{theme.name === "light" ? <DarkIcon className="icon" /> : <LightIcon className="icon" />}
		</SecondaryButton>
	);
}
