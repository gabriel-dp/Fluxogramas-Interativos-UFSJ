import { Analytics } from "@vercel/analytics/react";

import AppProvider from "@/contexts/AppProvider";
import Router from "@/routes";

export default function App() {
	return (
		<AppProvider>
			<Router />
			<Analytics />
		</AppProvider>
	);
}
