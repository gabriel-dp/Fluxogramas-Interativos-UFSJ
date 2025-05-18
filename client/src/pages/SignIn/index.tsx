import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "@/contexts/auth/useAuth";
import { Routes } from "@/routes";

export default function SignIn() {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit() {
		if (await login({ username, password })) {
			navigate(Routes.dashboard, { replace: true });
		} else {
			setError("Invalid credentials. Please try again.");
		}
	}

	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<label>
				<p>Username</p>
				<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
			</label>
			<label>
				<p>Password</p>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			</label>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<div>
				<button type="button" onClick={() => void handleSubmit}>
					Submit
				</button>
			</div>
		</form>
	);
}
