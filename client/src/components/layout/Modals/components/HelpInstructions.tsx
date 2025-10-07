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
				margin: "0 auto",
				gap: "1rem",
				textAlign: "center",
				maxWidth: "25rem",
			}}
		>
			<h2 style={{ margin: "0 0.5rem" }}>Instruções</h2>
			<hr />
			<p style={{ marginBottom: "0.5rem 0" }}>
				Clique nos componentes que você já fez e visualize quais você poderá fazer.
			</p>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gridTemplateRows: "repeat(3, 4rem)",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<div style={{ transform: "scale(0.5)", height: "6rem", width: "6rem", justifySelf: "end" }}>
					<ComponentCard component={fakeComponents[0]} state={true} canChange={true} />
				</div>
				<span style={{ fontSize: "0.9rem", justifySelf: "start" }}>Concluído</span>

				<div style={{ transform: "scale(0.5)", height: "6rem", width: "6rem", justifySelf: "end" }}>
					<ComponentCard component={fakeComponents[1]} state={false} canChange={true} />
				</div>
				<span style={{ fontSize: "0.9rem", justifySelf: "start" }}>Liberado</span>

				<div style={{ transform: "scale(0.5)", height: "6rem", width: "6rem", justifySelf: "end" }}>
					<ComponentCard component={fakeComponents[2]} state={false} canChange={false} />
				</div>
				<span style={{ fontSize: "0.9rem", justifySelf: "start" }}>Bloqueado</span>
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
