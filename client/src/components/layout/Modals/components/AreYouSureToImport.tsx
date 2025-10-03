import Button from "@/components/ui/Button";

interface AreYouSureToImportProps {
	onConfirm: () => Promise<void> | void;
	onCancel: () => Promise<void> | void;
	finally: () => Promise<void> | void;
}

export default function AreYouSureToImport(props: AreYouSureToImportProps) {
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
			<h2 style={{ margin: "0 0.5rem" }}>Tem certeza que deseja importar?</h2>
			<p style={{ margin: "0.5rem 0" }}>Os dados atuais serão substituídos</p>
			<div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
				<Button onClick={() => void handleCancel()} category="secondary">
					Cancelar
				</Button>
				<Button onClick={() => void handleConfirm()} category="primary">
					Importar
				</Button>
			</div>
		</div>
	);
}
