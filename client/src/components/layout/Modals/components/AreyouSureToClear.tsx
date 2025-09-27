import Button from "@/components/ui/Button";

interface AreYouSureToClearProps {
	onConfirm: () => Promise<void> | void;
	onCancel: () => Promise<void> | void;
	finally: () => Promise<void> | void;
}

export default function AreYouSureToClear(props: AreYouSureToClearProps) {
	async function handleConfirm() {
		try {
			await props.onConfirm();
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
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				textAlign: "center",
				maxWidth: "25rem",
			}}
		>
			<h2 style={{ margin: "0 0.5rem" }}>Tem certeza que deseja limpar a grade?</h2>
			<p style={{ margin: "0.5rem 0" }}>Essa ação não pode ser desfeita.</p>
			<div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
				<Button onClick={() => void handleCancel()} category="secondary">
					Cancelar
				</Button>
				<Button onClick={() => void handleConfirm()} category="primary">
					Limpar
				</Button>
			</div>
		</div>
	);
}
