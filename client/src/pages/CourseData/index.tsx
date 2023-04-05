import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Course } from "@/services/course/types";
import { requestCourse } from "@/services/course/requests";
import Curriculum from "@/components/Curriculum";

import { Screen, Header, CurriculumContainer } from "./styles";

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
		<Screen>
			<Header>
				<p>{course?.name ?? code}</p>
				<div>
					<span>Turno: {course?.shift}</span>
					<span>Tipo: {course?.type}</span>
					<span>Campus: {course?.campus}</span>
				</div>
			</Header>
			<CurriculumContainer>
				<Curriculum course={course} />
			</CurriculumContainer>
		</Screen>
	);
}
