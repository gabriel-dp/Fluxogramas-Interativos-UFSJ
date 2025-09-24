import { IComponent } from "@/types/component";

import { CardContainer, CheckIcon, LockIcon, OpenIcon } from "./styles";

interface ComponentCardProps {
	subject: IComponent;
	state: boolean;
	canChange: boolean;
	onClick?: () => void;
	activityHours?: number;
}

export default function ComponentCard(props: ComponentCardProps) {
	const Icon = props.state ? CheckIcon : props.canChange ? OpenIcon : LockIcon;

	return (
		<CardContainer onClick={props.onClick} state={props.state} canChange={props.canChange} title={props.subject.name}>
			<p className="name">{props.subject.name}</p>
			{<Icon className="icon" />}
			{
				<span className="hours">
					{props.activityHours != undefined && (
						<span
							className={props.activityHours != 0 && props.activityHours != props.subject.hours ? "partial" : "total"}
						>
							{props.activityHours.toString() + "h / "}
						</span>
					)}
					<span className="total">{props.subject.hours}h</span>
				</span>
			}
		</CardContainer>
	);
}
