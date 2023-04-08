import { Course } from "@/services/course/types";

export async function requestAllCourses(): Promise<Course[]> {
	const baseUrl = `${import.meta.env.VITE_API_URL}/courses`;
	try {
		const response = await fetch(baseUrl);
		const data = await response.json();
		return data as Course[];
	} catch {
		return [];
	}
}

export async function requestCourse(code: string): Promise<Course | null> {
	const baseUrl = `${import.meta.env.VITE_API_URL}/courses/get/${code}`;
	try {
		const response = await fetch(baseUrl);
		const data = await response.json();
		return data as Course;
	} catch {
		return null;
	}
}
