import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

import { IComponent } from "@/types/component";
import useNotifications from "@/contexts/notifications/useNotifications";
import useComponentService from "@/services/componentService";
import TextField from "@/components/ui/TextField";
import OptionSelector from "@/components/ui/OptionSelector";
import EntityForm from "@/components/EntityForm";

interface ComponentFormFields {
	code: string;
	name: string;
	hours: number | string;
	semester: number | string | null;
	type: string;
}

interface ComponentFormI {
	courseId: number;
	selectedComponent: IComponent | null | undefined;
	refresh: () => void;
}

export default function ComponentForm(props: ComponentFormI) {
	const { createOne, updateOne, deleteOne } = useComponentService();
	const { add: addNotification } = useNotifications();

	const { control, reset, handleSubmit } = useForm<ComponentFormFields>({
		defaultValues: {
			code: "",
			name: "",
			hours: "0",
			semester: "1",
			type: "SUBJECT",
		},
	});

	useEffect(() => {
		if (props.selectedComponent) {
			reset({
				code: props.selectedComponent.code,
				name: props.selectedComponent.name,
				hours: props.selectedComponent.hours,
				semester: props.selectedComponent.semester,
				type: props.selectedComponent.type,
			});
		} else if (props.selectedComponent === null) {
			reset({
				code: "",
				name: "",
				hours: "0",
				semester: "1",
				type: "SUBJECT",
			});
		}
	}, [props.selectedComponent, reset]);

	if (props.selectedComponent === undefined) return null;

	async function onSubmit(data: ComponentFormFields) {
		// fix data number type
		data.hours = Number(data.hours);
		data.semester = data.semester ? Number(data.semester) : null;

		if (props.selectedComponent) {
			await updateOne(props.selectedComponent.id, { ...data, courseId: props.courseId });
		} else {
			await createOne({ ...data, courseId: props.courseId });
		}
		for (let i = 0; i < 5; i++) {
			setTimeout(() => {
				addNotification({ type: "success", message: "Componente salvo com sucesso" });
			}, i * 500);
		}
		props.refresh();
	}

	async function onDelete() {
		if (props.selectedComponent) {
			await deleteOne(props.selectedComponent.id);
		}
		addNotification({ type: "success", message: "Componente deletado" });
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
		>
			<div className="row">
				<Controller
					name="code"
					control={control}
					render={({ field }) => <TextField label="Código*" {...field} required />}
				/>
				<Controller
					name="name"
					control={control}
					render={({ field }) => <TextField label="Nome*" {...field} required />}
				/>
			</div>
			<div className="row">
				<Controller
					name="hours"
					control={control}
					render={({ field }) => <TextField label="Carga Horária*" type="number" {...field} required min={0} />}
				/>
				<Controller
					name="semester"
					control={control}
					render={({ field }) => <TextField label="Semestre" type="number" {...field} min={1} max={20} />}
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
