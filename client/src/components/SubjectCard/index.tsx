import { Subject } from "@/services/course/types";
import { CardContainer } from "./styles";

interface ISubject {
	subject: Subject;
	state: boolean;
	canChange: boolean;
	onClick?: () => void;
}

export default function SubjectCard(props: ISubject) {
	return (
		<CardContainer onClick={props.onClick} state={props.state} canChange={props.canChange}>
			{props.subject.name}
		</CardContainer>
	);
}
