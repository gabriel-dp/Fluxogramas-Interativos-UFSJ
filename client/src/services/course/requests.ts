import { Course } from "@/services/course/types";

export async function requestAllCourses(): Promise<Course[]> {
	const baseUrl = `${import.meta.env.VITE_API_URL as string}/course`;
	try {
		const response = await fetch(baseUrl);
		const data = (await response.json()) as Course[];
		return data;
	} catch {
		return [];
	}
}

export async function requestCourse(code: string): Promise<Course | null> {
	const baseUrl = `${import.meta.env.VITE_API_URL as string}/course/${code}`;
	try {
		const response = await fetch(baseUrl);
		const data = (await response.json()) as Course;
		return data;
	} catch {
		return null;
	}
}
