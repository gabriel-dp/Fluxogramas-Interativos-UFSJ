import useAuth from "@/contexts/auth/useAuth";

import { DashboardContainer, DashboardContent } from "./styles";

export default function Dashboard() {
	const { user } = useAuth();

	return (
		<DashboardContainer>
			<DashboardContent>
				<>
					<h1>Bem vindo, {user?.username}!</h1>
					<p>Use o menu lateral para navegar.</p>
				</>
			</DashboardContent>
		</DashboardContainer>
	);
}
