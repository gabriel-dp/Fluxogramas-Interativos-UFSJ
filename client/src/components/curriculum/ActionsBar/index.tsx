import { RefObject } from "react";
import { exportComponentAsPNG } from "react-component-export-image";
import {
	FaRegImage as ScreenshotIcon,
	FaTrashAlt as ClearIcon,
	FaFileImport as ImportIcon,
	FaFileExport as ExportIcon,
} from "react-icons/fa";

import useTheme from "@/contexts/theme/useTheme";
import useModal from "@/contexts/modal/useModal";
import Button from "@/components/ui/Button";
import AreYouSureToClear from "@/components/layout/Modals/components/AreyouSureToClear";

import { BarContainer } from "./styles";
import { CurriculumHandle } from "../Curriculum";

interface ActionsBarProps {
	curriculumHandleRef: RefObject<CurriculumHandle>;
}

export default function ActionsBar({ curriculumHandleRef: { current: curriculum } }: ActionsBarProps) {
	const { openModal, closeModal } = useModal();
	const theme = useTheme();

	async function handleSaveImageClick() {
		if (curriculum) {
			await curriculum.screenshot(async () => {
				await exportComponentAsPNG(curriculum.curriculumRef, {
					fileName: "curriculum",
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

	function handleClearButtonClick() {
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
			<Button title="Salvar como imagem" onClick={() => void handleSaveImageClick()}>
				<ScreenshotIcon className="icon" />
			</Button>
			<Button title="Importar arquivo">
				<ImportIcon className="icon" />
			</Button>
			<Button title="Exportar arquivo">
				<ExportIcon className="icon" style={{ transform: "translateX(0.125rem)" }} />
			</Button>
			<Button title="Limpar grade" onClick={handleClearButtonClick}>
				<ClearIcon className="icon" />
			</Button>
		</BarContainer>
	);
}
