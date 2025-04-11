import { ConfigsProvider } from "./configs";
import { ThemeProvider } from "./theme";

export default function AppProvider(props: React.PropsWithChildren) {
	return (
		<ConfigsProvider>
			<ThemeProvider>{props.children}</ThemeProvider>
		</ConfigsProvider>
	);
}
