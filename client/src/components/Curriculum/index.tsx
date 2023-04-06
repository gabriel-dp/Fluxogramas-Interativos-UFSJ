import { Course } from "@/services/course/types";
import SubjectCard from "@/components/SubjectCard";

import { Semester, CurriculumList } from "./styles";
import { useEffect, useState } from "react";

interface ICurriculum {
	course: Course | null;
}

export default function Curriculum(props: ICurriculum) {
	const [subjectsState, setSubjectsState] = useState<boolean[]>([]);

	useEffect(() => {
		if (props.course) {
			setSubjectsState(new Array<boolean>(props.course.curriculum.length).fill(false));
		}
	}, [props.course]);

	function getSubjectIndex(subjectName: string) {
		if (!props.course) return -1;
		return props.course.curriculum.findIndex((subject) => subject.name === subjectName);
	}

	function canChange(index: number) {
		if (!props.course) return false;

		const notActivePreRequisites = props.course.curriculum[index].preRequisites.every(
			(subjectName) => subjectsState[getSubjectIndex(subjectName)]
		);

		const notActivePostRequistes = props.course.curriculum.every(
			(subject) =>
				props.course &&
				(!subjectsState[getSubjectIndex(subject.name)] ||
					!subject.preRequisites.includes(props.course.curriculum[index].name))
		);

		return notActivePreRequisites && notActivePostRequistes;
	}

	function handleChangeSubjectState(index: number) {
		if (!props.course) return;

		if (canChange(index)) {
			const indexesChanged = [index];
			props.course.curriculum[index].coRequisites.forEach((coRequisite) =>
				indexesChanged.push(getSubjectIndex(coRequisite))
			);

			const newState = [...subjectsState];
			indexesChanged.forEach((indexChanged) => (newState[indexChanged] = !newState[indexChanged]));
			setSubjectsState(newState);
		}
	}

	return (
		<CurriculumList>
			{Array.from({ length: props.course?.semesters ?? 0 }).map((_, i) => (
				<Semester key={i}>
					<p>Semestre {i + 1}</p>
					{props.course?.curriculum.map((subject, j) => {
						if (subject.semester === i + 1)
							return (
								<SubjectCard
									key={`${subject.name}-${j}`}
									subject={subject}
									state={subjectsState[j]}
									canChange={canChange(j)}
									onClick={() => handleChangeSubjectState(j)}
								/>
							);
					})}
				</Semester>
			))}
		</CurriculumList>
	);
}
