import { useState } from "react";
import { ThemeProvider } from "styled-components";

import { DarkTheme, LightTheme } from "./styles/themes";
import GlobalStyle from "@/styles/global";
import Router from "@/routes";

export default function App() {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	function toggleTheme() {
		setTheme((actual) => (actual === "light" ? "dark" : "light"));
	}

	return (
		<ThemeProvider theme={theme === "light" ? LightTheme : DarkTheme}>
			<GlobalStyle />
			<Router toggleTheme={toggleTheme} />
		</ThemeProvider>
	);
}
