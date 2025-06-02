import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight as OpenIcon, MdClose as CloseIcon } from "react-icons/md";

import useAuth from "@/contexts/auth/useAuth";

import { DrawerContainer, DrawerContent, ToggleButton } from "./styles";
import { Routes } from "@/routes";

export default function Drawer() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();

	const courses = ["CCOMP-2023"];

	function handleNavigate(route: string) {
		navigate(route);
		setDrawerOpen(false);
	}

	const ADMIN_ROUTES = [
		{ route: Routes.dashboard_users, title: "Usuários" },
		{ route: Routes.dashboard_courses, title: "Cursos" },
	];

	return (
		<>
			<DrawerContainer open={drawerOpen}>
				<DrawerContent>
					{user?.isAdmin ? (
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
					) : (
						<div className="drawer-group">
							<h3 className="drawer-title">Cursos</h3>
							<ul>
								{courses.map((course) => (
									<li key={course} onClick={() => handleNavigate(Routes.dashboard_courses_course(course))}>
										{course}
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
