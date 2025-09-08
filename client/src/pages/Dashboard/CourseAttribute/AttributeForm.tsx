import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createAttributeSchema, IAttribute } from "@/types/course-attributes";
import EntityForm from "@/components/EntityForm";
import TextField from "@/components/ui/TextField";
import { ConflictException } from "@/utils/exceptionUtils";
import useNotifications from "@/contexts/notifications/useNotifications";
import useCourseTypeService from "@/services/courseTypeService";

interface UserFormFields {
	name: string;
}

interface UserFormI {
	entity: string;
	selectedAttribute: IAttribute | null | undefined;
	service: ReturnType<typeof useCourseTypeService>;
	refresh: () => void;
}

export default function UserForm(props: UserFormI) {
	const { addNotification } = useNotifications();
	const { createOne, updateOne, deleteOne } = props.service;
	const {
		control,
		reset,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = useForm<UserFormFields>({
		defaultValues: {
			name: "",
		},
		resolver: zodResolver(createAttributeSchema),
	});

	useEffect(() => {
		if (props.selectedAttribute) {
			reset({
				name: props.selectedAttribute.name,
			});
		} else if (props.selectedAttribute === null) {
			reset({
				name: "",
			});
		}
	}, [props.selectedAttribute, reset]);

	if (props.selectedAttribute === undefined) return null;

	async function onSubmit(data: UserFormFields) {
		try {
			if (props.selectedAttribute) {
				await updateOne(props.selectedAttribute.id, data);
				addNotification({
					type: "success",
					message: `${props.entity} #${props.selectedAttribute.id} atualizado com sucesso`,
				});
			} else {
				const { id } = await createOne(data);
				addNotification({ type: "success", message: `${props.entity} #${id} criado com sucesso` });
			}
		} catch (error) {
			if (error instanceof ConflictException) {
				setError("name", { message: "Nome em uso" });
			}
			throw error;
		}
		props.refresh();
	}

	async function onDelete() {
		if (props.selectedAttribute) {
			await deleteOne(props.selectedAttribute.id);
			addNotification({ type: "success", message: `${props.entity} #${props.selectedAttribute.id} deletado` });
		}
		props.refresh();
	}

	return (
		<EntityForm
			entity={props.entity}
			selectedEntity={props.selectedAttribute}
			onSubmit={(e) => {
				void handleSubmit(onSubmit)();
				e.preventDefault();
			}}
			onDelete={onDelete}
			hasError={!isValid}
		>
			<div className="row">
				<Controller
					name="name"
					control={control}
					render={({ field }) => <TextField label="Nome*" {...field} required error={errors.name?.message} />}
				/>
			</div>
		</EntityForm>
	);
}
