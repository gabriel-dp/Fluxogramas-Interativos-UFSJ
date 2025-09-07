import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ComponentType, createComponentSchema, IComponent } from "@/types/component";
import useNotifications from "@/contexts/notifications/useNotifications";
import useComponentService from "@/services/componentService";
import TextField from "@/components/ui/TextField";
import OptionSelector from "@/components/ui/OptionSelector";
import EntityForm from "@/components/EntityForm";
import { ConflictException } from "@/utils/exceptionUtils";

interface ComponentFormFields {
	code: string;
	name: string;
	hours: number;
	semester: number | null;
	type: "SUBJECT" | "ACTIVITY";
}

interface ComponentFormI {
	courseId: number;
	selectedComponent: IComponent | null | undefined;
	refresh: () => void;
}

export default function ComponentForm(props: ComponentFormI) {
	const { createOne, updateOne, deleteOne } = useComponentService();
	const { addNotification } = useNotifications();

	const {
		control,
		reset,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm<ComponentFormFields>({
		defaultValues: {
			code: "",
			name: "",
			hours: 0,
			semester: 1,
			type: ComponentType.SUBJECT,
		},
		resolver: zodResolver(createComponentSchema),
	});

	useEffect(() => {
		if (props.selectedComponent) {
			reset({
				code: props.selectedComponent.code,
				name: props.selectedComponent.name,
				hours: props.selectedComponent.hours,
				semester: props.selectedComponent.semester ?? null,
				type: props.selectedComponent.type,
			});
		} else if (props.selectedComponent === null) {
			reset({
				code: "",
				name: "",
				hours: 0,
				semester: 1,
				type: "SUBJECT",
			});
		}
	}, [props.selectedComponent, reset]);

	if (props.selectedComponent === undefined) return null;

	async function onSubmit(data: ComponentFormFields) {
		// fix data number type
		data.hours = Number(data.hours);
		data.semester = data.semester ? Number(data.semester) : null;

		try {
			if (props.selectedComponent) {
				const { code } = await updateOne(props.selectedComponent.id, { ...data, courseId: props.courseId });
				addNotification({
					type: "success",
					message: `Componente '${code}' atualizado com sucesso`,
				});
			} else {
				const { code } = await createOne({ ...data, courseId: props.courseId });
				addNotification({ type: "success", message: `Componente '${code}' criado com sucesso` });
			}
		} catch (error) {
			if (error instanceof ConflictException) {
				setError("code", { message: "Código em uso" });
			}
			throw error;
		}

		props.refresh();
	}

	async function onDelete() {
		if (props.selectedComponent) {
			await deleteOne(props.selectedComponent.id);
			addNotification({ type: "success", message: `Componente '${props.selectedComponent.code}' deletado` });
		}
		props.refresh();
	}

	return (
		<EntityForm
			entity="Componente"
			selectedEntity={props.selectedComponent}
			onSubmit={(e) => {
				void handleSubmit(onSubmit)();
				e.preventDefault();
			}}
			onDelete={onDelete}
			hasError={!isValid}
		>
			<div className="row">
				<Controller
					name="code"
					control={control}
					render={({ field }) => <TextField label="Código*" {...field} required error={errors.code?.message} />}
				/>
				<Controller
					name="name"
					control={control}
					render={({ field }) => <TextField label="Nome*" {...field} required error={errors.name?.message} />}
				/>
			</div>
			<div className="row">
				<Controller
					name="hours"
					control={control}
					render={({ field }) => (
						<TextField label="Carga Horária*" type="number" {...field} error={errors.hours?.message} />
					)}
				/>
				<Controller
					name="semester"
					control={control}
					render={({ field }) => (
						<TextField label="Semestre" type="number" {...field} error={errors.semester?.message} />
					)}
				/>
				<Controller
					name="type"
					control={control}
					render={({ field }) => (
						<OptionSelector
							label="Tipo*"
							options={[
								{ label: "Disciplina", value: "SUBJECT" },
								{ label: "Atividade", value: "ACTIVITY" },
							]}
							{...field}
						/>
					)}
				/>
			</div>
		</EntityForm>
	);
}
