import { IComponent } from "@/types/component";

import { CardContainer, CheckIcon, LockIcon, OpenIcon } from "./styles";

interface ComponentCardProps {
	subject: IComponent;
	state: boolean;
	canChange: boolean;
	onClick?: () => void;
}

export default function ComponentCard(props: ComponentCardProps) {
	const Icon = props.state ? CheckIcon : props.canChange ? OpenIcon : LockIcon;

	return (
		<CardContainer onClick={props.onClick} state={props.state} canChange={props.canChange}>
			<p className="name">{props.subject.name}</p>
			{<Icon />}
		</CardContainer>
	);
}
