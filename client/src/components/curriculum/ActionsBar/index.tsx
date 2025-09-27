import {
	FaRegImage as ScreenshotIcon,
	FaTrashAlt as ClearIcon,
	FaFileImport as ImportIcon,
	FaFileExport as ExportIcon,
} from "react-icons/fa";

import Button from "@/components/ui/Button";

import { BarContainer } from "./styles";

export default function ActionsBar() {
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
			<Button title="Limpar grade">
				<ClearIcon className="icon" />
			</Button>
		</BarContainer>
	);
}
