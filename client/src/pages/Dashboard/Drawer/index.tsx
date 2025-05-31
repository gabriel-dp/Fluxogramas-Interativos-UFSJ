import { useState } from "react";
import { MdKeyboardArrowRight as OpenIcon, MdClose as CloseIcon } from "react-icons/md";

import useAuth from "@/contexts/auth/useAuth";

import { DrawerContainer, DrawerContent, ToggleButton } from "./styles";

interface DrawerProps {
	displayUsers: () => void;
	displayCourse: (course: string) => void;
}

export default function Drawer(props: DrawerProps) {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { user } = useAuth();

	const courses = ["CCOMP-2023"];

	function handleDisplayUsers() {
		props.displayUsers();
		setDrawerOpen(false);
	}

	function handleDisplayCourse(course: string) {
		props.displayCourse(course);
		setDrawerOpen(false);
	}

	return (
		<>
			<DrawerContainer open={drawerOpen}>
				<DrawerContent>
					{user?.isAdmin && (
						<>
							<div className="drawer-group">
								<h3 className="drawer-title">Gestão</h3>
								<ul>
									<li onClick={handleDisplayUsers}>Usuários</li>
								</ul>
							</div>
							<hr />
						</>
					)}
					<div className="drawer-group">
						<h3 className="drawer-title">Cursos</h3>
						<ul>
							{courses.map((course) => (
								<li key={course} onClick={() => handleDisplayCourse(course)}>
									{course}
								</li>
							))}
						</ul>
					</div>
				</DrawerContent>
				<ToggleButton onClick={() => setDrawerOpen((state) => !state)}>
					{drawerOpen ? <CloseIcon className="icon" /> : <OpenIcon className="icon" />}
				</ToggleButton>
			</DrawerContainer>
		</>
	);
}
