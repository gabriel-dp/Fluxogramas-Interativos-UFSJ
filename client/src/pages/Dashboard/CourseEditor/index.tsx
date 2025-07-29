import { useParams } from "react-router-dom";

import { DashboardContent } from "../styles";

export default function CourseEditor() {
	const { code } = useParams();

	return <DashboardContent>{code}</DashboardContent>;
}
