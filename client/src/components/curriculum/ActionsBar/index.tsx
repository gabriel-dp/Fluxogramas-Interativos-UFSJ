import { RefObject, useRef } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import {
	FaRegImage as ScreenshotIcon,
	FaTrashAlt as ClearIcon,
	FaFileImport as ImportIcon,
	FaFileExport as ExportIcon,
} from "react-icons/fa";

import { CurriculumDump } from "@/hooks/useCurriculum";
import useTheme from "@/contexts/theme/useTheme";
import useModal from "@/contexts/modal/useModal";
import Button from "@/components/ui/Button";
import AreYouSureToClear from "@/components/layout/Modals/components/AreyouSureToClear";

import { BarContainer } from "./styles";
import { CurriculumHandle } from "../Curriculum";

interface ActionsBarProps {
	curriculumHandleRef: RefObject<CurriculumHandle>;
}

export default function ActionsBar({ curriculumHandleRef }: ActionsBarProps) {
	const { openModal, closeModal } = useModal();
	const theme = useTheme();

	async function handleSaveImageButton() {
		const curriculum: CurriculumHandle | null = curriculumHandleRef.current;
		if (curriculum) {
			await curriculum.screenshot(async () => {
				await exportComponentAsPNG(curriculum.curriculumRef, {
					fileName: "curriculum-print",
					html2CanvasOptions: {
						ignoreElements: (element: Element) => {
							if (typeof element.className !== "string") return false;
							return element.className.includes("remove-export");
						},
						backgroundColor: theme.background,
					},
				});
			});
		}
	}

	const fileInputRef = useRef<HTMLInputElement>(null);
	function handleImportButton(e: React.ChangeEvent<HTMLInputElement>) {
		const curriculum: CurriculumHandle | null = curriculumHandleRef.current;
		if (curriculum) {
			const file = e.target.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const obj = JSON.parse(event.target?.result as string) as CurriculumDump;
					curriculum.reset(obj);
				} catch (err) {
					console.error("Invalid JSON file", err);
				}
			};
			reader.readAsText(file);
		}
	}

	function handleExportButton() {
		const curriculum: CurriculumHandle | null = curriculumHandleRef.current;
		if (curriculum) {
			const obj = curriculum.generateDump();
			const json = JSON.stringify(obj, null, 2); // pretty print
			const blob = new Blob([json], { type: "application/json" });
			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = "curriculum-dump.json";
			a.click();

			URL.revokeObjectURL(url); // cleanup
		}
	}

	function handleClearButton() {
		const curriculum: CurriculumHandle | null = curriculumHandleRef.current;
		function onConfirm() {
			curriculum?.reset();
		}

		const modalId = openModal({
			content: (
				<AreYouSureToClear
					onConfirm={onConfirm}
					onCancel={() => closeModal(modalId)}
					finally={() => closeModal(modalId)}
				/>
			),
		});
	}

	return (
		<BarContainer>
			<Button title="Salvar como imagem" onClick={() => void handleSaveImageButton()}>
				<ScreenshotIcon className="icon" />
			</Button>
			<Button title="Importar arquivo" onClick={() => fileInputRef.current?.click()}>
				<ImportIcon className="icon" />
				<input
					type="file"
					accept="application/json"
					ref={fileInputRef}
					style={{ display: "none" }}
					onChange={handleImportButton}
				/>
			</Button>
			<Button title="Exportar arquivo" onClick={handleExportButton}>
				<ExportIcon className="icon" style={{ transform: "translateX(0.125rem)" }} />
			</Button>
			<Button title="Limpar grade" onClick={handleClearButton}>
				<ClearIcon className="icon" />
			</Button>
		</BarContainer>
	);
}
