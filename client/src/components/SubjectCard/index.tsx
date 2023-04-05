import { Subject } from "@/services/course/types";
import { CardContainer } from "./styles";

interface ISubject {
	subject: Subject;
}

export default function SubjectCard(props: ISubject) {
	return <CardContainer>{props.subject.name}</CardContainer>;
}
