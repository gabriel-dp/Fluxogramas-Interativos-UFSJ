import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
	const { isAuthenticated, login, logout } = useAuth();

	return (
		<div>
			{isAuthenticated ? (
				<>
					<h1>Welcome! You are logged in.</h1>
					<button onClick={logout}>Logout</button>
				</>
			) : (
				<>
					<h1>Please log in</h1>
					<button onClick={() => login("sample-token")}>Login</button>
				</>
			)}
		</div>
	);
}
