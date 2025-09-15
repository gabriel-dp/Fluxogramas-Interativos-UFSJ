import ComponentCard from "@/components/ComponentCard";
import { ICourseComponents } from "@/types/course";

import { Semester, CurriculumList } from "./styles";
import useCurriculum from "@/hooks/useCurriculum";

interface ICurriculum {
	course: ICourseComponents;
}

export default function Curriculum({ course }: ICurriculum) {
	const { semesters, canChange, states, change, get } = useCurriculum(course.components);

	function handleChangeSemesterState(i: number) {
		const semester = get(semesters, i);
		const state = semester.some(({ id }) => !states[id] && canChange(id));
		semester.forEach(({ id }) => {
			if (states[id] !== state) {
				change(id);
			}
		});
	}

	return (
		<CurriculumList className="curriculum">
			{[...semesters.entries()].map(([i, components]) => (
				<Semester key={i}>
					<p className="semester-title" onClick={() => handleChangeSemesterState(i)}>
						Semestre {i}
					</p>
					{components.map((component) => (
						<ComponentCard
							key={component.id}
							subject={component}
							state={states[component.id]}
							canChange={canChange(component.id)}
							onClick={() => change(component.id)}
						/>
					))}
				</Semester>
			))}
		</CurriculumList>
	);
}
