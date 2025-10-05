import { ConfigsProvider } from "./configs/ConfigsContext";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./theme/ThemeContext";
import { ModalProvider } from "./modal/ModalContext";
import { NotificationsProvider } from "./notifications/NotificationsContext";

export default function AppProvider(props: React.PropsWithChildren) {
	return (
		<ConfigsProvider>
			<ThemeProvider>
				<AuthProvider>
					<ModalProvider>
						<NotificationsProvider>{props.children}</NotificationsProvider>
					</ModalProvider>
				</AuthProvider>
			</ThemeProvider>
		</ConfigsProvider>
	);
}
