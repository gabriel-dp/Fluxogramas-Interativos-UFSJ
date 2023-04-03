import { ThemeProvider } from "styled-components";

import { DarkTheme } from "./styles/themes";
import GlobalStyle from "@/styles/global";
import Router from "@/routes";

export default function App() {
	return (
		<ThemeProvider theme={DarkTheme}>
			<GlobalStyle />
			<Router />
		</ThemeProvider>
	);
}
