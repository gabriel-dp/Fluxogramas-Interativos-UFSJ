import { BrowserRouter, Routes as RouteGroup, Route, Outlet, Navigate } from "react-router-dom";

import useAuth from "@/contexts/auth/useAuth";
import ActionButtons from "@/components/ActionButtons";
import Drawer from "@/components/Drawer";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import CourseData from "@/pages/CourseData";
import SignIn from "@/pages/SignIn";
import UsersList from "@/pages/Dashboard/UsersList";
import CoursesList from "@/pages/Dashboard/CoursesList";
import CourseEditor from "./pages/Dashboard/CourseEditor";

const ProtectedRoute = () => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? (
		<div style={{ display: "flex" }}>
			<Drawer />
			<Outlet />
		</div>
	) : (
		<Navigate to="/sign-in" replace />
	);
};

export const Routes = {
	home: "/",
	signIn: "/sign-in",
	dashboard: "/dashboard",
	dashboard_users: "/dashboard/users",
	dashboard_courses: "/dashboard/courses",
	dashboard_courses_course: (code: string) => `/dashboard/courses/${code}`,
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
					<Route path={Routes.dashboard_users} element={<UsersList />} />
					<Route path={Routes.dashboard_courses} element={<CoursesList />} />
					<Route path={Routes.dashboard_courses_course(":code")} element={<CourseEditor />} />
				</Route>
				<Route path="*" element={<Navigate to={Routes.home} />} />
			</RouteGroup>
		</BrowserRouter>
	);
}
