import { forwardRef, RefObject, useEffect, useImperativeHandle, useRef } from "react";
import { toPng } from "html-to-image";
import {
	FaRegImage as ScreenshotIcon,
	FaTrashAlt as ClearIcon,
	FaFileImport as ImportIcon,
	FaFileExport as ExportIcon,
	FaQuestion as HelpIcon,
} from "react-icons/fa";

import { CurriculumDump } from "@/hooks/useCurriculum";
import useStoredState from "@/hooks/useStoredState";
import useTheme from "@/contexts/theme/useTheme";
import useModal from "@/contexts/modal/useModal";
import Button from "@/components/ui/Button";
import AreYouSureToClear from "@/components/layout/Modals/components/AreyouSureToClear";
import AreYouSureToImport from "@/components/layout/Modals/components/AreYouSureToImport";
import HelpInstructions from "@/components/layout/Modals/components/HelpInstructions";
import { CurriculumHandle } from "@/components/curriculum/Curriculum";

import { BarContainer } from "./styles";

interface ActionsBarProps {
	code: string;
	curriculumHandleRef: RefObject<CurriculumHandle>;
}

export interface ActionsBarHandle {
	setSave: (newValue: CurriculumDump | ((previousValue: CurriculumDump) => CurriculumDump)) => void;
}

const ActionsBar = forwardRef<ActionsBarHandle, ActionsBarProps>(({ curriculumHandleRef, code }, ref) => {
	const { openModal, closeModal } = useModal();
	const theme = useTheme();

	const [save, setSave] = useStoredState<CurriculumDump>(
		code,
		curriculumHandleRef.current?.generateDump() ?? { states: {}, activityHours: {}, optionalNames: {} },
	);

	async function handleSaveImageButton() {
		const curriculum: CurriculumHandle | null = curriculumHandleRef.current;
		if (curriculum) {
			await curriculum.screenshot(async () => {
				if (curriculum.curriculumRef.current == null) return;
				const link = document.createElement("a");
				link.download = "curriculum.png";
				link.href = await toPng(curriculum.curriculumRef.current, {
					cacheBust: true,
					backgroundColor: theme.background,
					filter(domNode) {
						if (typeof domNode.className !== "string") return true;
						return !domNode.className.includes("remove-export");
					},
				});
				link.click();
			});
		}
	}

	const fileInputRef = useRef<HTMLInputElement>(null);
	function handleImportButton(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const copy = new File([file], file.name, {
			type: file.type,
			lastModified: file.lastModified,
		});

		function onConfirm() {
			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					if (curriculumHandleRef.current && fileInputRef.current) {
						const obj = JSON.parse(event.target?.result as string) as CurriculumDump;
						curriculumHandleRef.current.reset(obj);
						fileInputRef.current.value = "";
					}
				} catch (err) {
					console.error("Invalid JSON file", err);
				}
			};
			reader.readAsText(copy);
		}

		const modalId = openModal({
			content: (
				<AreYouSureToImport
					onConfirm={onConfirm}
					onCancel={() => closeModal(modalId)}
					finally={() => closeModal(modalId)}
				/>
			),
		});

		e.target.value = "";
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

	function handleHelpButton() {
		const modalId = openModal({
			content: <HelpInstructions finally={() => closeModal(modalId)} />,
		});
	}

	// Set initial value only once
	const initialStates = useRef(save);
	useEffect(() => {
		curriculumHandleRef.current?.reset(initialStates.current);
	}, [curriculumHandleRef]);

	// Expose data to parent
	useImperativeHandle(ref, () => ({
		setSave,
	}));

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
			<Button title="Ajuda" onClick={handleHelpButton}>
				<HelpIcon className="icon" />
			</Button>
		</BarContainer>
	);
});

ActionsBar.displayName = "ActionsBar";

export default ActionsBar;
