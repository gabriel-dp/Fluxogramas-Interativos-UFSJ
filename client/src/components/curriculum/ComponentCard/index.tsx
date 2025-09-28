import { FaPencilAlt as EditIcon } from "react-icons/fa";

import { IComponent } from "@/types/component";

import { CardContainer, CheckIcon, LockIcon, OpenIcon } from "./styles";

interface ComponentCardProps {
	component: IComponent;
	state: boolean;
	canChange: boolean;
	onClick?: () => void;
	activityHours?: number;
	optionalClick?: () => void;
	optionalName?: string;
}

export default function ComponentCard(props: ComponentCardProps) {
	const Icon = props.state ? CheckIcon : props.canChange ? OpenIcon : LockIcon;

	return (
		<CardContainer onClick={props.onClick} state={props.state} canChange={props.canChange} title={props.component.name}>
			<p className="name" lang="pt">
				{props.component.name}
				{props.optionalName && props.optionalName != props.component.name && ` (${props.optionalName})`}
			</p>
			{props.optionalClick && (
				<div className="edit remove-export" onClick={props.optionalClick}>
					<EditIcon />
				</div>
			)}
			{<Icon className="icon" />}
			{
				<span className="hours">
					{props.activityHours != undefined && (
						<span
							className={props.activityHours != 0 && props.activityHours != props.component.hours ? "partial" : "total"}
						>
							{props.activityHours.toString() + "h / "}
						</span>
					)}
					<span className="total">{props.component.hours}h</span>
				</span>
			}
		</CardContainer>
	);
}
