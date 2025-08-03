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
	const { createOne, updateOne, deleteOne } = useUserService();
	const { control, reset, handleSubmit } = useForm<UserFormFields>({
		defaultValues: {
			username: "",
			password: "",
		},
	});

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
			await updateOne(props.selectedUser.id, data);
		} else {
			await createOne(data);
		}
		props.refresh();
	}

	async function onDelete() {
		if (props.selectedUser) {
			await deleteOne(props.selectedUser.id);
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
			{props.selectedUser ? <h2>Editar Usuário ({props.selectedUser.id})</h2> : <h2>Novo Usuário</h2>}
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
					<Button onClick={() => void onDelete()} category="secondary">
						Deletar
					</Button>
				</div>
			) : (
				<div>
					<Button type="submit">Criar</Button>
				</div>
			)}
		</DashboardForm>
	);
}
