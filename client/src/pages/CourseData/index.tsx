import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaClock as TimeIcon, FaBook as BookIcon, FaMapMarkerAlt as LocationIcon } from "react-icons/fa";

import { Course } from "@/services/course/types";
import { requestCourse } from "@/services/course/requests";
import Curriculum from "@/components/Curriculum";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import FormEvaluationCard from "@/components/FormEvaluationCard";

import { Screen, Header, CurriculumContainer } from "./styles";

export default function CourseData() {
	const { code } = useParams();
	const [loading, setLoading] = useState(true);
	const [course, setCourse] = useState<Course | null>(null);

	useEffect(() => {
		async function asyncSetCourse() {
			setCourse(await requestCourse(code ?? ""));
			setLoading(false);
		}
		void asyncSetCourse();
	}, [code]);

	return (
		<Screen>
			<FormEvaluationCard />
			<Header>
				<p>{course ? course.name : "-"}</p>
				<div>
					<span>
						<TimeIcon className="icon" /> {course ? course.shift : "-"}
					</span>
					<span>
						<BookIcon className="icon" /> {course ? course.type : "-"}
					</span>
					<span>
						<LocationIcon className="icon" /> {course ? course.campus : "-"}
					</span>
				</div>
			</Header>
			<CurriculumContainer>
				{loading ? <Loading /> : !course ? <p>Course /{code}/ not found</p> : <Curriculum course={course} />}
			</CurriculumContainer>
			<Footer />
		</Screen>
	);
}
