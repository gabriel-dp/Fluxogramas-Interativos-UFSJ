import { ConfigsProvider } from "./configs/ConfigsContext";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./theme/ThemeContext";
import { NotificationsProvider } from "./notifications/NotificationsContext";

export default function AppProvider(props: React.PropsWithChildren) {
	return (
		<ConfigsProvider>
			<ThemeProvider>
				<AuthProvider>
					<NotificationsProvider>{props.children}</NotificationsProvider>
				</AuthProvider>
			</ThemeProvider>
		</ConfigsProvider>
	);
}
