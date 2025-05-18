import { ConfigsProvider } from "./configs/ConfigsContext";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./theme/ThemeContext";

export default function AppProvider(props: React.PropsWithChildren) {
	return (
		<ConfigsProvider>
			<ThemeProvider>
				<AuthProvider>{props.children}</AuthProvider>
			</ThemeProvider>
		</ConfigsProvider>
	);
}
