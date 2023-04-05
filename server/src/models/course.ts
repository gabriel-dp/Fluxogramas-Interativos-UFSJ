import mongoose from "mongoose";

import { rNumber, rString } from "./modelTypes";

const couseSchema = new mongoose.Schema({
	code: rString,
	name: rString,
	shift: rString,
	campus: rString,
	type: rString,
	semesters: rNumber,
	curriculum: [
		{
			name: rString,
			hours: rNumber,
			semester: rNumber,
			preRequisites: [rString],
			coRequisites: [rString],
		},
	],
});

export default mongoose.model("Course", couseSchema);
