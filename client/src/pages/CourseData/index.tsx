import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FaClock as TimeIcon, FaBook as BookIcon, FaMapMarkerAlt as LocationIcon } from "react-icons/fa";

import { ICourseComponents } from "@/types/course";
import useCourseService from "@/services/courseService";
import Curriculum, { CurriculumHandle } from "@/components/curriculum/Curriculum";
import ActionsBar, { ActionsBarHandle } from "@/components/curriculum/ActionsBar";
import Loading from "@/components/ui/Loading";
import Footer from "@/components/layout/Footer";
import useModal from "@/contexts/modal/useModal";
import HelpInstructions from "@/components/layout/Modals/components/HelpInstructions";
import useStoredState from "@/hooks/useStoredState";

import { Screen, Header, CurriculumContainer, ActionsBarContainer } from "./styles";

export default function CourseData() {
	const { code } = useParams();
	const { readByCode } = useCourseService();
	const [instructionsState, setInstructionsState] = useStoredState("instructions", { displayed: false });
	const { openModal, closeModal } = useModal();
	const [loading, setLoading] = useState(true);
	const [course, setCourse] = useState<ICourseComponents | null>(null);

	const curriculumHandleRef = useRef<CurriculumHandle>(null);
	const actionsHandleRef = useRef<ActionsBarHandle>(null);

	useEffect(() => {
		async function asyncSetCourse() {
			if (code) {
				setCourse(await readByCode(code));
				setLoading(false);
			}
		}
		void asyncSetCourse();
	}, [readByCode, code]);

	// Open modal just once and never again
	// Can run twice in development mode due react strict mode
	useEffect(() => {
		if (!instructionsState.displayed) {
			const modalId = openModal({
				content: (
					<HelpInstructions
						finally={() => {
							closeModal(modalId);
						}}
					/>
				),
			});
			setInstructionsState({ displayed: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [openModal, closeModal]);

	function onChange() {
		if (curriculumHandleRef.current && actionsHandleRef.current) {
			actionsHandleRef.current.setSave(curriculumHandleRef.current.generateDump());
		}
	}

	return (
		<Screen>
			<Header>
				<p>{course ? course.name : "-"}</p>
				<div>
					<span>
						<TimeIcon className="icon" /> {course ? course.shift.name : "-"}
					</span>
					<span>
						<BookIcon className="icon" /> {course ? course.type.name : "-"}
					</span>
					<span>
						<LocationIcon className="icon" /> {course ? course.campus.name : "-"}
					</span>
				</div>
			</Header>
			<CurriculumContainer>
				{loading ? (
					<Loading />
				) : !course ? (
					<p>Course /{code}/ not found</p>
				) : (
					<Curriculum ref={curriculumHandleRef} course={course} onChange={onChange} />
				)}
			</CurriculumContainer>
			<ActionsBarContainer>
				{course && <ActionsBar ref={actionsHandleRef} code={course.code} curriculumHandleRef={curriculumHandleRef} />}
			</ActionsBarContainer>
			<Footer />
		</Screen>
	);
}
