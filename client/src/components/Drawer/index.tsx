import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight as OpenIcon, MdClose as CloseIcon } from "react-icons/md";

import { Routes } from "@/routes";
import { ICourseComplete } from "@/types/course";
import useAuth from "@/contexts/auth/useAuth";
import useCourseService from "@/services/courseService";
import Button from "@/components/ui/Button";

import { DrawerContainer, DrawerContent, ToggleButton } from "./styles";

export default function Drawer() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { readAllByUser } = useCourseService();

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [courses, setCourses] = useState<ICourseComplete[]>([]);

	useEffect(() => {
		async function getCourses() {
			if (user && !user.isAdmin) {
				setCourses(await readAllByUser(user.id));
			}
		}
		void getCourses();
	}, [readAllByUser, user]);

	function handleNavigate(route: string) {
		navigate(route);
		setDrawerOpen(false);
	}

	const ADMIN_ROUTES = [
		{ route: Routes.dashboard_users, title: "Usuários" },
		{ route: Routes.dashboard_courses, title: "Cursos" },
	];

	const PARAM_ROUTES = [
		{ route: Routes.dashboard_courses_type, title: "Tipos" },
		{ route: Routes.dashboard_courses_shift, title: "Turnos" },
		{ route: Routes.dashboard_courses_campus, title: "Campus" },
	];

	return (
		<>
			<DrawerContainer open={drawerOpen}>
				<DrawerContent>
					<Button onClick={() => handleNavigate(Routes.dashboard)}>Menu</Button>
					{user?.isAdmin ? (
						<>
							<div className="drawer-group">
								<h3 className="drawer-title">Administração</h3>
								<ul>
									{ADMIN_ROUTES.map((route) => (
										<li onClick={() => handleNavigate(route.route)} key={route.route}>
											{route.title}
										</li>
									))}
								</ul>
							</div>
							<div className="drawer-group">
								<h3 className="drawer-title">Parametrização</h3>
								<ul>
									{PARAM_ROUTES.map((route) => (
										<li onClick={() => handleNavigate(route.route)} key={route.route}>
											{route.title}
										</li>
									))}
								</ul>
							</div>
						</>
					) : (
						<div className="drawer-group">
							<h3 className="drawer-title">Cursos</h3>
							<ul>
								{courses.map((course) => (
									<li
										key={course.id}
										onClick={() => handleNavigate(Routes.dashboard_courses_course(course.id.toString()))}
									>
										{course.name}
									</li>
								))}
							</ul>
						</div>
					)}
				</DrawerContent>
				<ToggleButton onClick={() => setDrawerOpen((state) => !state)}>
					{drawerOpen ? <CloseIcon className="icon" /> : <OpenIcon className="icon" />}
				</ToggleButton>
			</DrawerContainer>
		</>
	);
}
