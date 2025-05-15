import AppProvider from "@/contexts";
import Router from "@/routes";

export default function App() {
	return (
		<AppProvider>
			<Router />
		</AppProvider>
	);
}
