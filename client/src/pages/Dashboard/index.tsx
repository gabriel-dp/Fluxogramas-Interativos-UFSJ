import useAuth from "@/contexts/auth/useAuth";

export default function Dashboard() {
	const { logout } = useAuth();

	return (
		<div>
			<h1>Welcome! You are logged in.</h1>
			<button onClick={() => void logout()}>Logout</button>
		</div>
	);
}
