import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaClock as TimeIcon, FaBook as BookIcon, FaMapMarkerAlt as LocationIcon } from "react-icons/fa";

import { ICourseComponents } from "@/types/course";
import useCourseService from "@/services/courseService";
import Curriculum, { CurriculumHandle } from "@/components/curriculum/Curriculum";
import Loading from "@/components/ui/Loading";
import Footer from "@/components/layout/Footer";
import ActionsBar from "@/components/curriculum/ActionsBar";

import { Screen, Header, CurriculumContainer, ActionsBarContainer } from "./styles";

export default function CourseData() {
	const { code } = useParams();
	const { readByCode } = useCourseService();
	const [loading, setLoading] = useState(true);
	const [course, setCourse] = useState<ICourseComponents | null>(null);

	const curriculumHandleRef = useRef<CurriculumHandle>(null);

	useEffect(() => {
		async function asyncSetCourse() {
			if (code) {
				setCourse(await readByCode(code));
				setLoading(false);
			}
		}
		void asyncSetCourse();
	}, [readByCode, code]);

	return (
		<Screen>
			<Header>
				<p>{course ? course.name : "-"}</p>
				<div>
					<span>
						<TimeIcon className="icon" /> {course ? course.shift.name : "-"}
					</span>
					<span>
						<BookIcon className="icon" /> {course ? course.type.name : "-"}
					</span>
					<span>
						<LocationIcon className="icon" /> {course ? course.campus.name : "-"}
					</span>
				</div>
			</Header>
			<CurriculumContainer>
				{loading ? (
					<Loading />
				) : !course ? (
					<p>Course /{code}/ not found</p>
				) : (
					<Curriculum ref={curriculumHandleRef} course={course} />
				)}
			</CurriculumContainer>
			<ActionsBarContainer>{course && <ActionsBar curriculumHandleRef={curriculumHandleRef} />}</ActionsBarContainer>
			<Footer />
		</Screen>
	);
}
