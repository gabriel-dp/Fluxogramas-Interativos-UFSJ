import { BrowserRouter, Routes as RouteGroup, Route, Outlet, Navigate } from "react-router-dom";

import useAuth from "@/contexts/auth/useAuth";
import ActionButtons from "@/components/ActionButtons";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import CourseData from "@/pages/CourseData";
import SignIn from "@/pages/SignIn";

const ProtectedRoute = () => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export const Routes = {
	home: "/",
	signIn: "/sign-in",
	dashboard: "/dashboard",
	course: (code: string) => `/curso/${code}`,
};

export default function Router() {
	return (
		<BrowserRouter>
			<ActionButtons />
			<RouteGroup>
				<Route path={Routes.home} element={<Home />} />
				<Route path={Routes.signIn} element={<SignIn />} />
				<Route path={Routes.course(":code")} element={<CourseData />} />
				<Route element={<ProtectedRoute />}>
					<Route path={Routes.dashboard} element={<Dashboard />} />
				</Route>
				<Route path="*" element={<Navigate to={Routes.home} />} />
			</RouteGroup>
		</BrowserRouter>
	);
}
