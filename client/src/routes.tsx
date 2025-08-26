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
import CourseEditor from "@/pages/Dashboard/CourseEditor";

export const Routes = {
	home: "/",
	signIn: "/sign-in",
	dashboard: "/dashboard",
	dashboard_users: "/dashboard/users",
	dashboard_courses: "/dashboard/courses",
	dashboard_courses_course: (id: string) => `/dashboard/courses/${id}`,
	course: (code: string) => `/${code}`,
};

const DashboardProtectedRoute = () => {
	const { isAuthenticated } = useAuth();
	return isAuthenticated ? (
		<div style={{ display: "flex" }}>
			<Drawer />
			<Outlet />
		</div>
	) : (
		<Navigate to={Routes.signIn} replace />
	);
};

const DashboardAdminRoute = () => {
	const { user } = useAuth();
	return user?.isAdmin ? <Outlet /> : <Navigate to={Routes.dashboard} replace />;
};

export default function Router() {
	return (
		<BrowserRouter>
			<ActionButtons />
			<RouteGroup>
				<Route path={Routes.home} element={<Home />} />
				<Route path={Routes.signIn} element={<SignIn />} />
				<Route element={<DashboardProtectedRoute />}>
					<Route path={Routes.dashboard} element={<Dashboard />} />
					<Route element={<DashboardAdminRoute />}>
						<Route path={Routes.dashboard_users} element={<UsersList />} />
						<Route path={Routes.dashboard_courses} element={<CoursesList />} />
					</Route>
					<Route path={Routes.dashboard_courses_course(":id")} element={<CourseEditor />} />
				</Route>
				<Route path={Routes.course(":code")} element={<CourseData />} />
				<Route path="*" element={<Navigate to={Routes.home} />} />
			</RouteGroup>
		</BrowserRouter>
	);
}
