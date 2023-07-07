import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { requestAllCourses } from "@/services/course/requests";
import { Course } from "@/services/course/types";
import SearchBar from "@/components/SearchBar";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import ThemeSwitch from "@/components/ThemeSwitch";
import logo from "@/assets/logo.png";

import { CourseElement, CoursesContainer, HomeContainer, Screen, LogoImage } from "./styles";

interface HomeProps {
	toggleTheme: () => void;
}

export default function Home(props: HomeProps) {
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [allCourses, setAllCourses] = useState<Course[]>([]);
	const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

	useEffect(() => {
		async function asyncSetAllCourses() {
			setAllCourses(await requestAllCourses());
			setLoading(false);
		}
		asyncSetAllCourses();
	}, []);

	useEffect(() => {
		if (allCourses.length > 0) {
			const normalizeString = (str: string) =>
				str
					.toLowerCase()
					.normalize("NFD")
					.replace(/\p{Diacritic}/gu, "");

			setSelectedCourses(allCourses.filter((course) => normalizeString(course.name).includes(normalizeString(search))));
		}
	}, [allCourses, search]);

	const navigate = useNavigate();
	function handleCourseClick(code: string) {
		navigate(code);
	}

	return (
		<Screen>
			<HomeContainer>
				<ThemeSwitch toggleTheme={props.toggleTheme} />
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
									<span>{course.shift}</span>
									<span>{course.type}</span>
									<span>{course.campus}</span>
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
