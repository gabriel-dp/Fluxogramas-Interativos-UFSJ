import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/auth/useAuth";

export default function Dashboard() {
	const navigate = useNavigate();
	const { isAuthenticated, logout } = useAuth();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/sign-in", { replace: true });
		}
	}, [isAuthenticated, navigate]);
	if (!isAuthenticated) return null;

	return (
		<div>
			<h1>Welcome! You are logged in.</h1>
			<button onClick={logout}>Logout</button>
		</div>
	);
}
