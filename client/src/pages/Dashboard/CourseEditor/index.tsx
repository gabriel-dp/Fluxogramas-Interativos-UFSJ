import { useParams } from "react-router-dom";

export default function CourseEditor() {
	const { code } = useParams();

	return <>{code}</>;
}
