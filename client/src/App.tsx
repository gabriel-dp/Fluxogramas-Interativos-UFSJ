import { Analytics } from "@vercel/analytics/react";

import AppProvider from "@/contexts";
import Router from "@/routes";
import ActionButtons from "@/components/ActionButtons";

export default function App() {
	return (
		<AppProvider>
			<Router />
			<ActionButtons />
			<Analytics />
		</AppProvider>
	);
}
