import { BrowserRouter, Routes, Route } from "react-router-dom";

import ActionButtons from "@/components/ActionButtons";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import CourseData from "@/pages/CourseData";

export default function Router() {
	return (
		<BrowserRouter>
			<ActionButtons />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/:code" element={<CourseData />} />
			</Routes>
		</BrowserRouter>
	);
}
