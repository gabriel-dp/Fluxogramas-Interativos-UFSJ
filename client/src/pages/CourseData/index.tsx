import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Course } from "@/services/course/types";
import { requestCourse } from "@/services/course/requests";
import Curriculum from "@/components/Curriculum";
import { FaClock, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";

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
					<span>
						<FaClock className="icon" /> {course?.shift}
					</span>

					<span>
						<FaGraduationCap className="icon" /> {course?.type}
					</span>

					<span>
						<FaMapMarkerAlt className="icon" /> {course?.campus}
					</span>
				</div>
			</Header>
			<CurriculumContainer>
				<Curriculum course={course} />
			</CurriculumContainer>
		</Screen>
	);
}
