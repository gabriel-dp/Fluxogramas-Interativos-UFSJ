import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight as OpenIcon, MdClose as CloseIcon } from "react-icons/md";
import {
	FaUsers as UsersIcon,
	FaMapMarkerAlt as LocalIcon,
	FaClock as TimeIcon,
	FaBook as BookIcon,
	FaGraduationCap as GraduationIcon,
} from "react-icons/fa";

import { Routes } from "@/routes";
import { ICourseComplete } from "@/types/course";
import useAuth from "@/contexts/auth/useAuth";
import useCourseService from "@/services/courseService";
import logo from "@/assets/logo.png";

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

	const ADMIN_DRAWER_ROUTES = [
		{
			group: "Administração",
			routes: [
				{ route: Routes.dashboard_users, title: "Usuários", icon: UsersIcon },
				{ route: Routes.dashboard_courses, title: "Cursos", icon: GraduationIcon },
			],
		},
		{
			group: "Parametrização",
			routes: [
				{ route: Routes.dashboard_courses_type, title: "Tipos", icon: BookIcon },
				{ route: Routes.dashboard_courses_shift, title: "Turnos", icon: TimeIcon },
				{ route: Routes.dashboard_courses_campus, title: "Campus", icon: LocalIcon },
			],
		},
	];

	return (
		<>
			<DrawerContainer open={drawerOpen}>
				<DrawerContent>
					<img src={logo} alt={"menu"} onClick={() => handleNavigate(Routes.dashboard)} />
					{user?.isAdmin ? (
						ADMIN_DRAWER_ROUTES.map(({ group, routes }) => (
							<div className="drawer-group" key={group}>
								<hr />
								<h3 className="drawer-title">{group}</h3>
								<ul>
									{routes.map(({ title, icon: Icon, route }) => (
										<li key={route} onClick={() => handleNavigate(route)}>
											<Icon className="icon" />
											<span>{title}</span>
										</li>
									))}
								</ul>
							</div>
						))
					) : (
						<div className="drawer-group">
							<hr />
							<h3 className="drawer-title">Cursos</h3>
							<ul>
								{courses.map(({ id, name }) => (
									<li key={id} onClick={() => handleNavigate(Routes.dashboard_courses_course(id.toString()))}>
										<GraduationIcon className="icon" />
										<span>{name}</span>
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
