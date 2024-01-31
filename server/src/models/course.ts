import mongoose from "mongoose";

import { rNumber, rString } from "./modelTypes";

interface Subject {
	id: string;
	name: string;
	hours: number;
	semester: number;
	preRequisites: string[];
	coRequisites: string[];
}

interface Course {
	code: string;
	name: string;
	shift: string;
	campus: string;
	type: string;
	semesters: number;
	curriculum: Subject[];
}

const couseSchema = new mongoose.Schema<Course>({
	code: rString,
	name: rString,
	shift: rString,
	campus: rString,
	type: rString,
	semesters: rNumber,
	curriculum: [
		{
			id: rString,
			name: rString,
			hours: rNumber,
			semester: rNumber,
			preRequisites: [rString],
			coRequisites: [rString],
		},
	],
});

export default mongoose.model("Course", couseSchema);
