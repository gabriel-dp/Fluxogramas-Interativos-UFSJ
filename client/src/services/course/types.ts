export interface Subject {
	name: string;
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
	curriculum?: Subject[];
}
