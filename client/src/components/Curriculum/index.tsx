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

	const canChange: (index: number) => boolean = (index: number) => {
		if (!props.course) return false;

		const notActivePreRequisites = (i: number) =>
			props.course !== null &&
			props.course.curriculum[i].preRequisites.every((subjectName) => subjectsState[getSubjectIndex(subjectName)]);

		const notActivePostRequistes = (i: number) =>
			props.course !== null &&
			props.course.curriculum.every(
				(subject) =>
					props.course &&
					(!subjectsState[getSubjectIndex(subject.name)] ||
						!subject.preRequisites.includes(props.course.curriculum[i].name))
			);

		const validCoRequisites = (i: number) =>
			props.course !== null &&
			props.course.curriculum[i].coRequisites.every((coRequisiteName) => {
				const coRequisiteIndex = getSubjectIndex(coRequisiteName);
				return subjectsState[coRequisiteIndex] || canChange(coRequisiteIndex);
			});

		console.log(
			props.course.curriculum[index].name,
			notActivePreRequisites(index),
			notActivePostRequistes(index),
			validCoRequisites(index)
		);

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
