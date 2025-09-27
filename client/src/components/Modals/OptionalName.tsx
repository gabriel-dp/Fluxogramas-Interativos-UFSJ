import { useState } from "react";

import { IComponent } from "@/types/component";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";

interface OptionalNameProps {
	component: IComponent;
	defaultValue: string;
	onConfirm: (value: string) => Promise<void> | void;
	onCancel: () => Promise<void> | void;
	finally: () => Promise<void> | void;
}

export default function OptionalName({ component, ...props }: OptionalNameProps) {
	const [value, setValue] = useState<string>(props.defaultValue);

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
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "1rem",
				padding: "0 0.5rem",
			}}
			onSubmit={(e) => {
				e.preventDefault();
				void handleConfirm();
			}}
		>
			<h2>{component.name}</h2>
			<p>Defina o nome da disciplina</p>
			<div style={{ width: "min(100%, 17rem)", display: "flex", flexDirection: "column", gap: "1rem" }}>
				<div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%" }}>
					<TextField label="Nome" value={value} onChange={(e) => setValue(e.target.value)} />
				</div>
				<div
					style={{ display: "flex", justifyContent: "center", columnGap: "1.5rem", rowGap: "0.5rem", flexWrap: "wrap" }}
				>
					<Button onClick={() => void handleCancel()} category="secondary">
						Cancelar
					</Button>
					<Button onClick={() => void handleConfirm()} category="primary">
						Confirmar
					</Button>
				</div>
			</div>
		</form>
	);
}
