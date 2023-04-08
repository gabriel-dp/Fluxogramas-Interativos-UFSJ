import { ThemeProvider } from "styled-components";

import { DarkTheme, LightTheme } from "./styles/themes";
import GlobalStyle from "@/styles/global";
import Router from "@/routes";
import useLocalStorage from "./hooks/useLocalStorage";

export default function App() {
	const [theme, setTheme] = useLocalStorage("CurriculumUFSJ-Theme", { name: "light" });

	function toggleTheme() {
		setTheme(theme.name === "light" ? { name: "dark" } : { name: "light" });
	}

	return (
		<ThemeProvider theme={theme.name === "light" ? LightTheme : DarkTheme}>
			<GlobalStyle />
			<Router toggleTheme={toggleTheme} />
		</ThemeProvider>
	);
}
