import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Routes } from "@/routes";
import useCourseService from "@/services/courseService";
import { ICourseComplete } from "@/types/course";
import SearchBar from "@/components/ui/SearchBar";
import Loading from "@/components/ui/Loading";
import Footer from "@/components/layout/Footer";
import logo from "@/assets/logo.webp";

import { CourseElement, CoursesContainer, HomeContainer, Screen, LogoImage } from "./styles";
import { normalizeString } from "@/utils/stringUtils";

export default function Home() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const { readAll } = useCourseService();
	const [search, setSearch] = useState(queryParams.get("search") ?? "");
	const [loading, setLoading] = useState(true);
	const [allCourses, setAllCourses] = useState<ICourseComplete[]>([]);
	const [selectedCourses, setSelectedCourses] = useState<ICourseComplete[]>([]);

	useEffect(() => {
		async function asyncSetAllCourses() {
			setAllCourses(await readAll());
			setLoading(false);
		}
		void asyncSetAllCourses();
	}, [readAll]);

	useEffect(() => {
		if (allCourses.length > 0) {
			setSelectedCourses(allCourses.filter((course) => normalizeString(course.name).includes(normalizeString(search))));
		}
	}, [allCourses, search]);

	const navigate = useNavigate();
	function handleCourseClick(code: string) {
		navigate(Routes.course(code));
	}

	return (
		<Screen>
			<HomeContainer>
				<LogoImage src={logo} alt="CurriculumUFSJ-logo" />
				<SearchBar placeholder="Pesquisar curso..." search={search} setSearch={setSearch} />
				<CoursesContainer>
					{loading ? (
						<Loading />
					) : (
						selectedCourses.map((course) => (
							<CourseElement key={course.code} onClick={() => handleCourseClick(course.code)}>
								<div className="course-name">
									<p>{course.name}</p>
								</div>
								<div className="course-data">
									<span>{course.shift.name}</span>
									<span>{course.type.name}</span>
									<span>{course.campus.name}</span>
								</div>
							</CourseElement>
						))
					)}
				</CoursesContainer>
			</HomeContainer>
			<Footer />
		</Screen>
	);
}
