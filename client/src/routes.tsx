import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
}
