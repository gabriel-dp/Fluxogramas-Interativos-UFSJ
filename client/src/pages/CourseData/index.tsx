import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaClock, FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";

import { Course } from "@/services/course/types";
import { requestCourse } from "@/services/course/requests";
import Curriculum from "@/components/Curriculum";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import ThemeSwitch from "@/components/ThemeSwitch";

import { Screen, Header, CurriculumContainer } from "./styles";

interface HomeProps {
	toggleTheme: () => void;
}

export default function CourseData(props: HomeProps) {
	const { code } = useParams();
	const [loading, setLoading] = useState(true);
	const [course, setCourse] = useState<Course | null>(null);

	useEffect(() => {
		async function asyncSetCourse() {
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
				<ThemeSwitch toggleTheme={props.toggleTheme} />
			</Header>
			<CurriculumContainer loading={loading}>
				{loading && course ? <Loading /> : <Curriculum course={course} />}
			</CurriculumContainer>
			<Footer />
		</Screen>
	);
}
