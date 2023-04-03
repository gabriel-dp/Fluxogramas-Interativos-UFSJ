import { Course } from "@/services/course/types";
import SearchBar from "@/components/SearchBar";

import { CourseElement, CoursesContainer, HomeContainer, Screen } from "./styles";

const courses: Course[] = [
	{
		code: "CCOMP",
		name: "Ciência da Computação",
		shift: "Integral",
		campus: "CTAN",
		type: "Bacharelado",
	},
	{
		code: "QUI",
		name: "Química",
		shift: "Noturno",
		campus: "CDB",
		type: "Licenciatura",
	},
];

export default function Home() {
	return (
		<Screen>
			<HomeContainer>
				<SearchBar placeholder="Pesquisar curso..." />
				<CoursesContainer>
					{courses.map((course) => (
						<CourseElement key={course.code}>
							<div className="course-name">
								<p>{course.name}</p>
							</div>
							<div className="course-data">
								<span>{course.shift}</span>
								<span>{course.type}</span>
								<span>{course.campus}</span>
							</div>
						</CourseElement>
					))}
				</CoursesContainer>
			</HomeContainer>
		</Screen>
	);
}
