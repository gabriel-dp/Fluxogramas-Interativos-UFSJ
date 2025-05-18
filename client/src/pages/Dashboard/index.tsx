import { useEffect, useState } from "react";

import { IUser } from "@/types/user";
import useApi from "@/hooks/useApi";
import useAuth from "@/contexts/auth/useAuth";

export default function Dashboard() {
	const api = useApi();
	const { user, logout } = useAuth();
	const [users, setUsers] = useState<IUser[]>([]);

	useEffect(() => {
		async function requestUsers() {
			if (user?.isAdmin) {
				const response = await api.get<IUser[]>("user");
				setUsers(response.data);
			}
		}
		void requestUsers();
	}, [api, user]);

	return (
		<div>
			<h1>Welcome {user?.username}! You are logged in.</h1>
			<button onClick={() => void logout()}>Logout</button>
			{user?.isAdmin ? (
				<ul>
					{users.map((user, i) => (
						<li key={i}>{JSON.stringify(user)}</li>
					))}
				</ul>
			) : (
				<p>not admin</p>
			)}
		</div>
	);
}
