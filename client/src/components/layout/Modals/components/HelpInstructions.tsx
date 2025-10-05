import ComponentCard from "@/components/curriculum/ComponentCard";
import Button from "@/components/ui/Button";
import { ComponentType, IComponent } from "@/types/component";
import { BrowserView, MobileView } from "react-device-detect";

interface HelpInstructionsProps {
	finally: () => Promise<void> | void;
}

const fakeComponents: IComponent[] = [
	{
		name: "Cálculo 1",
		id: 0,
		code: "FAKE1",
		courseId: 0,
		hours: 60,
		requisites: [],
		semester: 1,
		type: ComponentType.SUBJECT,
	},
	{
		name: "Cálculo 2",
		id: 1,
		code: "FAKE2",
		courseId: 0,
		hours: 60,
		requisites: [],
		semester: 2,
		type: ComponentType.SUBJECT,
	},
	{
		name: "Cálculo 3",
		id: 2,
		code: "FAKE3",
		courseId: 0,
		hours: 60,
		requisites: [],
		semester: 3,
		type: ComponentType.SUBJECT,
	},
];

export default function HelpInstructions(props: HelpInstructionsProps) {
	async function handleConfirm() {
		await props.finally();
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
			<h2 style={{ margin: "0 0.5rem" }}>Instruções</h2>
			<hr />
			<p style={{ marginBottom: "0.5rem 0" }}>
				Clique nos componentes que você já fez
				<br />e visualize quais você poderá fazer.
			</p>
			<div style={{ display: "flex", flexDirection: "column", margin: "auto", zoom: "0.5", gap: "1rem" }}>
				<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
					<ComponentCard component={fakeComponents[0]} state={true} canChange={true} />
					<span style={{ fontSize: "1.75rem" }}>Concluído</span>
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
					<ComponentCard component={fakeComponents[1]} state={false} canChange={true} />
					<span style={{ fontSize: "1.75rem" }}>Liberado</span>
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
					<ComponentCard component={fakeComponents[2]} state={false} canChange={false} />
					<span style={{ fontSize: "1.75rem" }}>Bloqueado</span>
				</div>
			</div>
			<hr />
			<div>
				<BrowserView>
					<b>Botão direito do mouse</b>
				</BrowserView>
				<MobileView>
					<b>Pressione e segure</b>
				</MobileView>
				para visualizar os requisitos
			</div>
			<hr />
			<div style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem" }}>
				<Button onClick={() => void handleConfirm()} category="primary">
					OK, entendi
				</Button>
			</div>
		</div>
	);
}
