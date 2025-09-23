import { useMemo } from "react";

import { ICourseComponents } from "@/types/course";
import useCurriculum from "@/hooks/useCurriculum";
import ComponentCard from "@/components/ComponentCard";
import ProgressBar from "@/components/ProgressBar";

import { ActivitiesList, CurriculumWrapper, ProgressBarContainer, Semester, SemestersList } from "./styles";

interface ICurriculum {
	course: ICourseComponents;
}

export default function Curriculum({ course }: ICurriculum) {
	const { semesters, canChange, states, change, get } = useCurriculum(course.components);

	const progress = useMemo(() => {
		let total = 0,
			finished = 0;
		[...semesters.entries()].forEach(([i, semester]) => {
			semester.forEach((c) => {
				if (i > -1) {
					total += c.hours;
					if (states[c.id]) {
						finished += c.hours;
					}
				}
			});
		});
		if (total == 0) return 0;
		return finished / total;
	}, [semesters, states]);

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
		<CurriculumWrapper>
			<SemestersList>
				{[...semesters.entries()].map(([i, components]) =>
					i === 0 ? null : (
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
					),
				)}
			</SemestersList>
			<ActivitiesList>
				{semesters
					.get(0)
					?.map((component) => (
						<ComponentCard
							key={component.id}
							subject={component}
							state={states[component.id]}
							canChange={canChange(component.id)}
							onClick={() => change(component.id)}
						/>
					))}
			</ActivitiesList>
			<ProgressBarContainer>
				<ProgressBar percentage={progress * 100} />
				<span className="percentage">{(progress * 100).toFixed(0)}%</span>
			</ProgressBarContainer>
		</CurriculumWrapper>
	);
}
