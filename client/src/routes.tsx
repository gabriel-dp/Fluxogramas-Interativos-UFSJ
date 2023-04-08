import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import CourseData from "./pages/CourseData";

interface RouterProps {
	toggleTheme: () => void;
}

export default function Router(props: RouterProps) {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home toggleTheme={props.toggleTheme} />} />
				<Route path="/:code" element={<CourseData toggleTheme={props.toggleTheme} />} />
			</Routes>
		</BrowserRouter>
	);
}
