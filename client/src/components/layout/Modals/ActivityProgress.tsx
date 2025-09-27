import { useState } from "react";

import { IComponent } from "@/types/component";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";

interface ActivityProgressProps {
	component: IComponent;
	defaultValue: number;
	onConfirm: (value: number) => Promise<void> | void;
	onCancel: () => Promise<void> | void;
	finally: () => Promise<void> | void;
}

export default function ActivityProgress({ component, ...props }: ActivityProgressProps) {
	const [value, setValue] = useState<number>(props.defaultValue > 0 ? props.defaultValue : component.hours);

	async function handleConfirm() {
		try {
			await props.onConfirm(value);
		} catch (error) {
			error;
		} finally {
			await props.finally();
		}
	}

	async function handleCancel() {
		await props.onCancel();
	}

	return (
		<form
			style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "0 0.5rem" }}
			onSubmit={(e) => {
				e.preventDefault();
				void handleConfirm();
			}}
		>
			<h2>{component.name}</h2>
			<p>Insira suas horas integralizadas da atividade</p>
			<div style={{ display: "flex", alignItems: "center", gap: "0.5rem", maxWidth: "10rem" }}>
				<TextField
					label="Horas"
					type="number"
					value={value}
					onChange={(e) => setValue(Number(e.target.value))}
					max={component.hours}
				/>
				<span style={{ whiteSpace: "nowrap", marginTop: "1rem" }}>&nbsp;/ {component.hours}h</span>
			</div>
			<div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
				<Button onClick={() => void handleCancel()} category="secondary">
					Cancelar
				</Button>
				<Button onClick={() => void handleConfirm()} category="primary">
					Confirmar
				</Button>
			</div>
		</form>
	);
}
