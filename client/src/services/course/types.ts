export interface Subject {
	name: string;
	semester: number;
	hours: number;
	preRequisites: string[];
	coRequisites: string[];
}

export interface Course {
	code: string;
	name: string;
	type: string;
	campus: string;
	shift: string;
	semesters: number;
	curriculum: Subject[];
}
