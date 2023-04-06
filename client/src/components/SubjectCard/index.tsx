import { Subject } from "@/services/course/types";
import { CardContainer, CheckIcon, LockIcon, OpenIcon } from "./styles";

interface ISubject {
	subject: Subject;
	state: boolean;
	canChange: boolean;
	onClick?: () => void;
}

export default function SubjectCard(props: ISubject) {
	return (
		<CardContainer onClick={props.onClick} state={props.state} canChange={props.canChange}>
			<p className="name">{props.subject.name}</p>
			{props.state && <CheckIcon />}
			{!props.state && !props.canChange && <LockIcon />}
			{!props.state && props.canChange && <OpenIcon />}
		</CardContainer>
	);
}
