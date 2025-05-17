import { ConfigsProvider } from "./configs/ConfigsContext";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./theme/ThemeContext";

export default function AppProvider(props: React.PropsWithChildren) {
	return (
		<ConfigsProvider>
			<AuthProvider>
				<ThemeProvider>{props.children}</ThemeProvider>
			</AuthProvider>
		</ConfigsProvider>
	);
}
