import { Course } from "@/services/course/types";

export async function requestAllCourses(): Promise<Course[]> {
	const baseUrl = `${import.meta.env.VITE_API_URL}/courses`;
	const response = await fetch(baseUrl);
	const data = await response.json();
	return data as Course[];
}
