import Button from "@/components/ui/Button";

interface AreYouSureToDeleteProps {
	onConfirm: () => Promise<void> | void;
	onCancel: () => Promise<void> | void;
	finally: () => Promise<void> | void;
}

export default function AreYouSureToDelete(props: AreYouSureToDeleteProps) {
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
			}}
		>
			<h2 style={{ margin: "0 0.5rem" }}>Tem certeza que deseja deletar?</h2>
			<p style={{ margin: "0.5rem 0" }}>Essa ação não pode ser desfeita.</p>
			<div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
				<Button onClick={() => void handleCancel()} category="secondary">
					Cancelar
				</Button>
				<Button onClick={() => void handleConfirm()} category="primary">
					Deletar
				</Button>
			</div>
		</div>
	);
}
