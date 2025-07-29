import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import useUserService from "@/services/userService";
import { IUser } from "@/types/user";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";

import { DashboardForm } from "../styles";

interface UserFormFields {
	username: string;
	password: string;
}

interface UserFormI {
	selectedUser: IUser | null | undefined;
	refresh: () => void;
}

export default function UserForm(props: UserFormI) {
	const { create, update } = useUserService();
	const { control, reset, handleSubmit } = useForm<UserFormFields>();

	useEffect(() => {
		if (props.selectedUser) {
			reset({
				username: props.selectedUser.username,
				password: props.selectedUser.password,
			});
		} else if (props.selectedUser === null) {
			reset({
				username: "",
				password: "",
			});
		}
	}, [props.selectedUser, reset]);

	if (props.selectedUser === undefined) return null;

	async function onSubmit(data: UserFormFields) {
		if (props.selectedUser) {
			console.log("editando:", data);
			await update({ ...data, id: props.selectedUser.id });
		} else {
			console.log("criando:", data);
			await create(data);
		}
		props.refresh();
	}
	return (
		<DashboardForm
			onSubmit={(e) => {
				void handleSubmit(onSubmit)();
				e.preventDefault();
			}}
		>
			{!props.selectedUser ? <h2>Novo Usuário</h2> : <h2>Editar Usuário ({props.selectedUser.id})</h2>}
			<div>
				<Controller
					name="username"
					control={control}
					render={({ field }) => <TextField label="Usuário*" {...field} required />}
				></Controller>
				{!props.selectedUser && (
					<Controller
						name="password"
						control={control}
						render={({ field }) => <TextField label="Senha*" type="password" {...field} required />}
					></Controller>
				)}
			</div>
			{props.selectedUser ? (
				<div>
					<Button type="submit">Salvar</Button>
					<Button category="secondary">Deletar</Button>
				</div>
			) : (
				<div>
					<Button type="submit">Criar</Button>
				</div>
			)}
		</DashboardForm>
	);
}
