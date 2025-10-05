import { DefaultTheme, ThemeProvider as StyledComponentsProvider } from "styled-components";

import useConfigs from "@/contexts/configs/useConfigs";
import Global from "@/styles/global";
import { LightTheme, DarkTheme } from "@/styles/themes";

export function ThemeProvider(props: { children: React.ReactNode }) {
	const { darkMode } = useConfigs();
	const theme: DefaultTheme = darkMode ? DarkTheme : LightTheme;

	return (
		<StyledComponentsProvider theme={theme}>
			<Global theme={theme} />
			{props.children}
		</StyledComponentsProvider>
	);
}
