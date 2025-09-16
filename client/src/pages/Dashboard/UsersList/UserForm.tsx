import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useNotifications from "@/contexts/notifications/useNotifications";
import useUserService from "@/services/userService";
import { createUserSchema, IUser, updateUserSchema } from "@/types/user";
import EntityForm from "@/components/EntityForm";
import TextField from "@/components/ui/TextField";
import Checkbox from "@/components/ui/Checkbox";
import { ConflictException } from "@/utils/exceptionUtils";
import useModal from "@/contexts/modal/useModal";
import AreYouSureToDelete from "@/components/Modals/AreYouSureToDelete";

interface UserFormFields {
	username: string;
	password?: string;
	isAdmin: boolean;
}

interface UserFormI {
	selectedUser: IUser | null | undefined;
	refresh: () => void;
}

export default function UserForm(props: UserFormI) {
	const { addNotification } = useNotifications();
	const { openModal, closeModal } = useModal();
	const { createOne, updateOne, deleteOne } = useUserService();
	const {
		control,
		reset,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = useForm<UserFormFields>({
		defaultValues: {
			username: "",
			password: "",
			isAdmin: false,
		},
		resolver: zodResolver(props.selectedUser ? updateUserSchema : createUserSchema),
		mode: "onChange",
	});

	useEffect(() => {
		if (props.selectedUser) {
			reset({
				username: props.selectedUser.username,
				password: props.selectedUser.password,
				isAdmin: props.selectedUser.isAdmin,
			});
		} else if (props.selectedUser === null) {
			reset({
				username: "",
				password: "",
				isAdmin: false,
			});
		}
	}, [props.selectedUser, reset]);

	if (props.selectedUser === undefined) return null;

	async function onSubmit(data: UserFormFields) {
		try {
			if (props.selectedUser) {
				await updateOne(props.selectedUser.id, data);
				addNotification({ type: "success", message: `Usuário #${props.selectedUser.id} atualizado com sucesso` });
			} else {
				const { id } = await createOne(data);
				addNotification({ type: "success", message: `Usuário #${id} criado com sucesso` });
			}
		} catch (error) {
			if (error instanceof ConflictException) {
				setError("username", { message: "Login em uso" });
			}
			throw error;
		}
		props.refresh();
	}

	function onDelete() {
		async function onConfirm() {
			if (props.selectedUser) {
				await deleteOne(props.selectedUser.id);
				addNotification({ type: "success", message: `Usuário #${props.selectedUser.id} deletado` });
			}
			props.refresh();
		}
		const modalId = openModal({
			content: (
				<AreYouSureToDelete
					onConfirm={onConfirm}
					onCancel={() => closeModal(modalId)}
					finally={() => closeModal(modalId)}
				/>
			),
		});
	}

	return (
		<EntityForm
			entity="Usuário"
			selectedEntity={props.selectedUser}
			onSubmit={(e) => {
				void handleSubmit(onSubmit)();
				e.preventDefault();
			}}
			onDelete={onDelete}
			hasError={!isValid}
		>
			<div className="row">
				<Controller
					name="username"
					control={control}
					render={({ field }) => <TextField label="Usuário*" {...field} required error={errors.username?.message} />}
				/>
				{!props.selectedUser && (
					<Controller
						name="password"
						control={control}
						render={({ field }) => (
							<TextField label="Senha*" type="password" {...field} required error={errors.password?.message} />
						)}
					/>
				)}
				<Controller
					name="isAdmin"
					control={control}
					render={({ field }) => (
						<Checkbox
							label="Administrador?"
							style={{ alignSelf: "flex-end" }}
							checked={!!field.value}
							onChange={(e) => field.onChange(e.target.checked)}
							ref={field.ref}
						/>
					)}
				/>
			</div>
		</EntityForm>
	);
}
