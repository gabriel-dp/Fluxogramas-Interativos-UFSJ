import { useState } from "react";

import useAuth from "@/contexts/auth/useAuth";

import Drawer from "./Drawer";
import UsersList from "./UsersList";
import CourseEditor from "./CourseEditor";
import { DashboardContainer, DashboardContent } from "./styles";

type SubPage = { page: "users" } | { page: "course"; code: string } | undefined;

export default function Dashboard() {
	const { user } = useAuth();
	const [subPage, setSubPage] = useState<SubPage>();

	function displayUsers() {
		if (user?.isAdmin) {
			setSubPage({ page: "users" });
		}
	}

	function displayCourse(code: string) {
		setSubPage({ page: "course", code });
	}

	return (
		<DashboardContainer>
			<Drawer displayUsers={displayUsers} displayCourse={displayCourse} />
			<DashboardContent>
				{!subPage && (
					<>
						<h1>Bem vindo {user?.username}!</h1>
						<p>Use o menu lateral para navegar.</p>
					</>
				)}
				{subPage && subPage?.page == "users" && user?.isAdmin && <UsersList />}
				{subPage && subPage?.page == "course" && <CourseEditor code={subPage.code} />}
			</DashboardContent>
		</DashboardContainer>
	);
}
