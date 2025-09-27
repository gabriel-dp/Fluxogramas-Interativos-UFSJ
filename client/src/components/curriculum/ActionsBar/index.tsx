import {
	FaRegImage as ScreenshotIcon,
	FaTrashAlt as ClearIcon,
	FaFileImport as ImportIcon,
	FaFileExport as ExportIcon,
} from "react-icons/fa";

import Button from "@/components/ui/Button";
import useModal from "@/contexts/modal/useModal";
import AreYouSureToClear from "@/components/layout/Modals/components/AreyouSureToClear";

import { BarContainer } from "./styles";
import { CurriculumHandle } from "../Curriculum";

interface ActionsBarProps {
	curriculumHandle: CurriculumHandle;
}

export default function ActionsBar({ curriculumHandle }: ActionsBarProps) {
	const { openModal, closeModal } = useModal();

	function handleClearButtonClick() {
		function onConfirm() {
			curriculumHandle.reset();
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
			<Button title="Salvar como imagem">
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
