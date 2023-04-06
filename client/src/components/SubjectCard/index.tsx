import { Subject } from "@/services/course/types";
import { CardContainer, CheckIcon, LockIcon, OpenIcon } from "./styles";

interface ISubject {
	subject: Subject;
	state: boolean;
	canChange: boolean;
	onClick?: () => void;
}

export default function SubjectCard(props: ISubject) {
	const Icon = props.state ? CheckIcon : props.canChange ? OpenIcon : LockIcon;

	return (
		<CardContainer onClick={props.onClick} state={props.state} canChange={props.canChange}>
			<p className="name">{props.subject.name}</p>
			{<Icon />}
		</CardContainer>
	);
}
