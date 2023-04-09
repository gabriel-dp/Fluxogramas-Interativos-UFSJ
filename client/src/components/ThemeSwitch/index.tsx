import { ThemeConsumer } from "styled-components";
import { FaSun, FaMoon } from "react-icons/fa";

import { ThemeButton } from "./styles";

interface SwitchProps {
	toggleTheme: () => void;
}

export default function ThemeSwitch(props: SwitchProps) {
	return (
		<ThemeConsumer>
			{(theme) => (
				<ThemeButton onClick={() => props.toggleTheme()} aria-label="theme-switcher">
					{theme.name === "light" ? <FaMoon className="icon" /> : <FaSun className="icon" />}
				</ThemeButton>
			)}
		</ThemeConsumer>
	);
}
