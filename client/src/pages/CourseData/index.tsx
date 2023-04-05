import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Course } from "@/services/course/types";
import { requestCourse } from "@/services/course/requests";
import SubjectCard from "@/components/SubjectCard";

import { Header, CurriculumContainer, Semester } from "./styles";

export default function CourseData() {
	const { code } = useParams();
	const [course, setCourse] = useState<Course | null>(null);

	useEffect(() => {
		async function asyncSetCourse() {
			setCourse(await requestCourse(code ?? ""));
		}
		asyncSetCourse();
	}, [code]);

	return (
		<>
			<Header>
				<p>{course?.name ?? code}</p>
				<div>
					<span>Turno: {course?.shift}</span>
					<span>Tipo: {course?.type}</span>
					<span>Campus: {course?.campus}</span>
				</div>
			</Header>
			<CurriculumContainer>
				{Array.from({ length: course?.semesters ?? 0 }).map((_, i) => (
					<Semester key={i}>
						<p>Semestre {i + 1}</p>
						{course?.curriculum.map((subject) => {
							console.log(subject.semester, i + 1);
							if (subject.semester === i + 1) return <SubjectCard subject={subject} />;
						})}
					</Semester>
				))}
			</CurriculumContainer>
		</>
	);
}
