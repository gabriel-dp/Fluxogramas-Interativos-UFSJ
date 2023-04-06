import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Course } from "@/services/course/types";
import { requestCourse } from "@/services/course/requests";
import Curriculum from "@/components/Curriculum";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";

import { FaClock, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";
import { Screen, Header, CurriculumContainer } from "./styles";

export default function CourseData() {
	const { code } = useParams();
	const [loading, setLoading] = useState(false);
	const [course, setCourse] = useState<Course>();

	useEffect(() => {
		async function asyncSetCourse() {
			setLoading(true);
			setCourse(await requestCourse(code ?? ""));
			setLoading(false);
		}
		asyncSetCourse();
	}, [code]);

	return (
		<Screen>
			<Header>
				<p>{course ? course.name : "-"}</p>
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
				{loading || course === undefined ? <Loading /> : <Curriculum course={course} />}
			</CurriculumContainer>
			<Footer />
		</Screen>
	);
}
