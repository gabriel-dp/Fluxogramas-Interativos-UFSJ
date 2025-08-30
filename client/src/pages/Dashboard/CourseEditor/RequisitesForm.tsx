import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaTrashAlt as DeleteIcon } from "react-icons/fa";

import { IComponent, Requisite } from "@/types/component";
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
	const { handleSubmit, watch, control, reset } = useForm<RequisiteFormFields>();
	const { setRequisites } = useComponentService();
	const [selectedRequisites, setSelectedRequisites] = useState<Requisite[]>([]);

	useEffect(() => {
		setSelectedRequisites(props.selectedComponent.requisites);
		reset({
			id: 0,
			corequisite: false,
		});
	}, [props.selectedComponent, reset]);

	if (props.selectedComponent === undefined) return null;

	async function onSubmit() {
		await setRequisites(props.selectedComponent.id, { requisites: selectedRequisites });
		props.refresh();
	}

	function onAdd() {
		if (Number(watch("id")) === 0) return;
		setSelectedRequisites((prev) => [...prev, { id: Number(watch("id")), corequisite: watch("corequisite") }]);
	}

	function onDelete(id: number) {
		setSelectedRequisites((prev) => prev.filter((r) => r.id !== id));
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
