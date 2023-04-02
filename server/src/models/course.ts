import mongoose from "mongoose";

import { rNumber, rString } from "./modelTypes";

const couseSchema = new mongoose.Schema({
	id: rString,
	name: rString,
	shift: rString,
	campus: rString,
	type: rString,
	curriculum: [
		{
			name: rString,
			hours: rNumber,
			preRequisites: [rString],
			coRequisites: [rString],
		},
	],
});

export default mongoose.model("Course", couseSchema);
