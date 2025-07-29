import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Routes } from "@/routes";
import useAuth from "@/contexts/auth/useAuth";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";

import { SignInFormContainer, SignInFormTitle } from "./styles";

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
		<SignInFormContainer onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
			<SignInFormTitle>Gestão</SignInFormTitle>
			<div className="fields">
				<TextField label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
				<TextField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			</div>
			<div className="actions">
				<Button category="primary" onClick={() => void handleSubmit()}>
					Entrar
				</Button>
			</div>
			{error && <p style={{ color: "red" }}>{error}</p>}
		</SignInFormContainer>
	);
}
