import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaTrashAlt as DeleteIcon } from "react-icons/fa";

import { IComponent, Requisite } from "@/types/component";
import useNotifications from "@/contexts/notifications/useNotifications";
import useComponentService from "@/services/componentService";
import OptionSelector from "@/components/ui/OptionSelector";
import EntityForm from "@/components/EntityForm";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

import { AddRequisiteRow, RequisitesList } from "./styles";

interface RequisiteFormFields {
	id: number;
	corequisite: boolean;
}

interface RequisiteFormI {
	selectedComponent: IComponent;
	components: IComponent[];
	refresh: () => void;
}

export default function RequisiteForm(props: RequisiteFormI) {
	const { addNotification } = useNotifications();
	const { setRequisites } = useComponentService();

	const { handleSubmit, watch, control, reset } = useForm<RequisiteFormFields>();
	const [selectedRequisites, setSelectedRequisites] = useState<Requisite[]>([]);
	const [changed, setChanged] = useState<boolean>(false);

	useEffect(() => {
		setSelectedRequisites(props.selectedComponent.requisites);
		setChanged(false);
		reset({
			id: 0,
			corequisite: false,
		});
	}, [props.selectedComponent, reset]);

	if (props.selectedComponent === undefined) return null;

	async function onSubmit() {
		await setRequisites(props.selectedComponent.id, { requisites: selectedRequisites });
		addNotification({ type: "success", message: "Requisitos definidos" });
		setChanged(false);
		props.refresh();
	}

	function onAdd() {
		if (Number(watch("id")) === 0) return;
		const newRequisite = { id: Number(watch("id")), corequisite: watch("corequisite") };
		setSelectedRequisites((prev) => [...prev, newRequisite]);

		reset({ id: 0, corequisite: false });
		addNotification({ type: "success", message: "Requisito adicionado (Não se esqueça de salvar)" });
		setChanged(true);
	}

	function onDelete(id: number) {
		setSelectedRequisites((prev) => prev.filter((r) => r.id !== id));
		addNotification({ type: "success", message: "Requisito removido (Não se esqueça de salvar)" });
		setChanged(true);
	}

	return (
		<EntityForm
			entity="Requisitos"
			selectedEntity={props.selectedComponent}
			onSubmit={(e) => {
				void handleSubmit(onSubmit)();
				e.preventDefault();
			}}
			hideEntityId
			hasError={!changed}
		>
			<AddRequisiteRow className="row">
				<Controller
					name="id"
					control={control}
					render={({ field }) => (
						<OptionSelector
							label="Componente"
							className="selector"
							options={props.components
								.filter((c) => c.id !== props.selectedComponent.id && !selectedRequisites.find((r) => r.id === c.id))
								.map((c) => ({ label: c.name, value: c.id }))}
							{...field}
						/>
					)}
				/>
				<Controller
					name="corequisite"
					control={control}
					render={({ field }) => (
						<Checkbox
							label="Co-requisito?"
							checked={!!field.value}
							onChange={(e) => field.onChange(e.target.checked)}
							ref={field.ref}
						/>
					)}
				/>
				<Button onClick={onAdd}>Adicionar</Button>
			</AddRequisiteRow>
			<hr />
			<RequisitesList>
				{selectedRequisites.length === 0 && <p className="empty">Não há requisitos</p>}
				{selectedRequisites
					.sort((a, b) => a.id - b.id)
					.map((r) => {
						const component = props.components.find((c) => c.id === r.id);
						return (
							<li key={r.id}>
								<Button onClick={() => onDelete(r.id)} category="secondary">
									<DeleteIcon className="icon" />
								</Button>
								<p>
									{component?.code} ({component?.name})
								</p>
							</li>
						);
					})}
			</RequisitesList>
			<hr />
		</EntityForm>
	);
}
