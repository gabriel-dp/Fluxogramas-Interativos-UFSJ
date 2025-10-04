import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle as AttentionIcon } from "react-icons/fa";

import { Routes } from "@/routes";
import useAuth from "@/contexts/auth/useAuth";
import useNotifications from "@/contexts/notifications/useNotifications";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import logo from "@/assets/logo.webp";

import { SignInFormContainer, SignInFormTitle, Wrapper } from "./styles";

interface LoginFields {
	username: string;
	password: string;
}

export default function SignIn() {
	const { login } = useAuth();
	const { addNotification } = useNotifications();
	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
		clearErrors,
		watch,
	} = useForm<LoginFields>({
		defaultValues: {
			username: "",
			password: "",
		},
	});

	watch(() => {
		if (Object.keys(errors).length > 0) {
			clearErrors(); // clears all errors whenever any field changes
		}
	});

	async function onSubmit(data: LoginFields) {
		if (await login({ username: data.username, password: data.password })) {
			navigate(Routes.dashboard, { replace: true });
		} else {
			setError("username", { message: "Credenciais inválidas" });
			addNotification({ type: "error", message: "Falha ao tentar fazer login" });
		}
	}

	return (
		<SignInFormContainer
			onSubmit={(e) => {
				void handleSubmit(onSubmit)();
				e.preventDefault();
			}}
		>
			<Wrapper>
				<SignInFormTitle>
					<img src={logo} alt="logo" />
				</SignInFormTitle>
				<div className="fields">
					<Controller
						name="username"
						control={control}
						render={({ field }) => <TextField label="Usuário" {...field} required />}
					/>
					<Controller
						name="password"
						control={control}
						render={({ field }) => <TextField label="Senha" type="password" {...field} required />}
					/>
				</div>
				{errors.username && (
					<div className="actions">
						<p className="error">
							<AttentionIcon className="icon" />
							{errors.username.message}
						</p>
					</div>
				)}
				<div className="actions">
					<Button category="primary" type="submit">
						Entrar
					</Button>
				</div>
			</Wrapper>
		</SignInFormContainer>
	);
}
