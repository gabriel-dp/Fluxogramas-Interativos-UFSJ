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

	function getSubjectIndex(subjectId: string) {
		if (!props.course) return -1;
		return props.course.curriculum.findIndex((subject) => subject.id === subjectId);
	}

	const canChange: (index: number) => boolean = (index: number) => {
		if (!props.course) return false;

		const notActivePreRequisites = (i: number) =>
			props.course !== null &&
			props.course.curriculum[i].preRequisites.every((subjectId) => subjectsState[getSubjectIndex(subjectId)]);

		const notActivePostRequistes = (i: number) =>
			props.course !== null &&
			props.course.curriculum.every(
				(subject) =>
					props.course &&
					(!subjectsState[getSubjectIndex(subject.id)] ||
						!subject.preRequisites.includes(props.course.curriculum[i].id))
			);

		const validCoRequisites = (i: number) =>
			props.course !== null &&
			props.course.curriculum[i].coRequisites.every((coRequisiteId) => {
				const coRequisiteIndex = getSubjectIndex(coRequisiteId);
				return subjectsState[coRequisiteIndex] || canChange(coRequisiteIndex);
			});

		return notActivePreRequisites(index) && notActivePostRequistes(index) && validCoRequisites(index);
	};

	function handleChangeSubjectState(index: number) {
		if (!props.course || !canChange(index)) return;

		const newState = [...subjectsState];
		newState[index] = !newState[index];
		setSubjectsState(newState);
	}

	return (
		<CurriculumList className="curriculum">
			{Array.from({ length: props.course?.semesters ?? 0 }).map((_, i) => (
				<Semester key={i}>
					<p className="semester-title">Semestre {i + 1}</p>
					{props.course?.curriculum.map((subject, j) => {
						if (subject.semester === i + 1)
							return (
								<SubjectCard
									key={`${subject.id}-${j}`}
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
