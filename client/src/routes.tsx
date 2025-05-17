import { BrowserRouter, Routes, Route } from "react-router-dom";

import ActionButtons from "@/components/ActionButtons";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import CourseData from "@/pages/CourseData";
import SignIn from "@/pages/SignIn";

export default function Router() {
	return (
		<BrowserRouter>
			<ActionButtons />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/curso/:code" element={<CourseData />} />
			</Routes>
		</BrowserRouter>
	);
}
