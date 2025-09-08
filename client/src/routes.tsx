import { BrowserRouter, Routes as RouteGroup, Route, Outlet, Navigate } from "react-router-dom";

import useAuth from "@/contexts/auth/useAuth";
import ActionButtons from "@/components/ActionButtons";
import Drawer from "@/components/Drawer";
import Notifications from "@/components/Notification";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import CourseData from "@/pages/CourseData";
import SignIn from "@/pages/SignIn";
import UsersList from "@/pages/Dashboard/UsersList";
import CoursesList from "@/pages/Dashboard/CoursesList";
import CourseEditor from "@/pages/Dashboard/CourseEditor";
import AttributesList from "@/pages/Dashboard/CourseAttribute";
import useCourseTypeService from "@/services/courseTypeService";
import useCourseShiftService from "@/services/courseShiftService";
import useCourseCampusService from "@/services/courseCampusService";

export const Routes = {
	home: "/",
	signIn: "/sign-in",
	dashboard: "/dashboard",
	dashboard_users: "/dashboard/users",
	dashboard_courses: "/dashboard/courses",
	dashboard_courses_type: "/dashboard/courses/type",
	dashboard_courses_shift: "/dashboard/courses/shift",
	dashboard_courses_campus: "/dashboard/courses/campus",
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
			<Notifications />
			<RouteGroup>
				<Route path={Routes.home} element={<Home />} />
				<Route path={Routes.signIn} element={<SignIn />} />
				<Route element={<DashboardProtectedRoute />}>
					<Route path={Routes.dashboard} element={<Dashboard />} />
					<Route element={<DashboardAdminRoute />}>
						<Route path={Routes.dashboard_users} element={<UsersList />} />
						<Route path={Routes.dashboard_courses} element={<CoursesList />} />
						<Route
							path={Routes.dashboard_courses_type}
							element={<AttributesList entity="Tipo" service={useCourseTypeService()} />}
						/>
						<Route
							path={Routes.dashboard_courses_shift}
							element={<AttributesList entity="Turno" service={useCourseShiftService()} />}
						/>
						<Route
							path={Routes.dashboard_courses_campus}
							element={<AttributesList entity="Campus" service={useCourseCampusService()} />}
						/>
					</Route>
					<Route path={Routes.dashboard_courses_course(":id")} element={<CourseEditor />} />
				</Route>
				<Route path={Routes.course(":code")} element={<CourseData />} />
				<Route path="*" element={<Navigate to={Routes.home} />} />
			</RouteGroup>
		</BrowserRouter>
	);
}
