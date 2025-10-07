import { Ref } from "react";
import { FaPencilAlt as EditIcon } from "react-icons/fa";
import { useLongPress } from "use-long-press";
import { isMobile } from "react-device-detect";

import { IComponent } from "@/types/component";

import { CardContainer, CheckIcon, LockIcon, OpenIcon } from "./styles";

interface ComponentCardProps {
	component: IComponent;
	state: boolean;
	canChange: boolean;
	onClick?: () => void;
	focusClick?: () => void;
	activityHours?: number;
	optionalClick?: () => void;
	optionalName?: string;
	$ref?: Ref<HTMLDivElement>;
}

export default function ComponentCard(props: ComponentCardProps) {
	const Icon = props.state ? CheckIcon : props.canChange ? OpenIcon : LockIcon;

	const bindLongClicks = useLongPress(() => {
		if (props.focusClick && isMobile) props.focusClick();
	});

	const componentName = () => {
		let name = props.component.name;
		if (props.optionalName && props.optionalName != props.component.name) name += ` - ${props.optionalName}`;
		return name;
	};

	return (
		<CardContainer
			ref={props.$ref}
			onClick={props.onClick}
			onContextMenu={(e) => {
				if (props.focusClick) {
					e.preventDefault();
					props.focusClick();
				}
			}}
			state={props.state}
			canChange={props.canChange}
			title={componentName()}
			{...bindLongClicks()}
		>
			<p className="name" lang="pt">
				{componentName()}
			</p>
			{props.optionalClick && (
				<div
					className="edit remove-export"
					onClick={(e) => {
						if (props.optionalClick) props.optionalClick();
						e.stopPropagation();
					}}
				>
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
