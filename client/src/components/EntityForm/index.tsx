import Button from "@/components/ui/Button";

import { DashboardForm } from "./styles";

interface EntityFormProps<T extends { id: number }> extends React.PropsWithChildren {
	entity: string;
	selectedEntity: T | null | undefined;
	onSubmit: React.FormEventHandler<HTMLFormElement>;
	onDelete?: () => Promise<void>;
	hideEntityId?: boolean;
}

export default function EntityForm<T extends { id: number }>({ hideEntityId = false, ...props }: EntityFormProps<T>) {
	return (
		<DashboardForm onSubmit={props.onSubmit}>
			{props.selectedEntity ? (
				<h2>
					Editar {props.entity} {!hideEntityId && `(${props.selectedEntity.id})`}
				</h2>
			) : (
				<h2>Criar {props.entity}</h2>
			)}
			<div>{props.children}</div>
			<div className="row">
				<Button type="submit">Salvar</Button>
				{props.selectedEntity && props.onDelete && (
					<Button onClick={() => props.onDelete && void props.onDelete()} category="secondary">
						Deletar
					</Button>
				)}
			</div>
		</DashboardForm>
	);
}
