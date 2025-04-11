import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import CourseData from "./pages/CourseData";

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/:code" element={<CourseData />} />
			</Routes>
		</BrowserRouter>
	);
}
