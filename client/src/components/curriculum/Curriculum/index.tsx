import { forwardRef, RefObject, useImperativeHandle, useMemo, useRef } from "react";

import { ICourseComponents } from "@/types/course";
import { ComponentType, IComponent } from "@/types/component";
import useModal from "@/contexts/modal/useModal";
import useCurriculum, { CurriculumDump } from "@/hooks/useCurriculum";
import ComponentCard from "@/components/curriculum/ComponentCard";
import ProgressBar from "@/components/curriculum/ProgressBar";
import ActivityProgress from "@/components/layout/Modals/components/ActivityProgress";
import OptionalName from "@/components/layout/Modals/components/OptionalName";

import { ActivitiesList, CurriculumWrapper, ProgressBarContainer, Semester, SemestersList } from "./styles";

interface ICurriculum {
	course: ICourseComponents;
}

export type CurriculumHandle = {
	reset: (dump?: CurriculumDump) => void;
	generateDump: () => CurriculumDump;
	curriculumRef: RefObject<HTMLDivElement>;
	screenshot: (save: () => Promise<void>) => Promise<void>;
};

const Curriculum = forwardRef<CurriculumHandle, ICurriculum>(({ course }, ref) => {
	const {
		semesters,
		canChange,
		states,
		change,
		changePartial,
		activityHours,
		changeName,
		optionalNames,
		reset,
		generateDump,
	} = useCurriculum(course.components);
	const { openModal, closeModal } = useModal();
	const curriculumRef = useRef<HTMLDivElement>(null);
	const semestersRef = useRef<HTMLDivElement>(null);
	const progressRef = useRef<HTMLDivElement>(null);

	const progress = useMemo(() => {
		let total = 0,
			finished = 0;
		[...semesters.entries()].forEach(([i, semester]) => {
			semester.forEach((c) => {
				total += c.hours;
				if (i > 0) {
					if (states[c.id]) {
						finished += c.hours;
					}
				} else {
					finished += activityHours[c.id];
				}
			});
		});
		if (total == 0) return 0;
		return finished / total;
	}, [semesters, states, activityHours]);

	function handleChangeSemesterState(i: number) {
		const semester = semesters.get(i);
		if (semester) {
			const state = semester.some(({ id }) => !states[id] && canChange(id));
			semester.forEach(({ id }) => {
				if (states[id] !== state) {
					change(id);
				}
			});
		}
	}

	function handleOptionalClick(component: IComponent) {
		function onConfirm(value: string) {
			changeName(component.id, value);
		}

		const modalId = openModal({
			content: (
				<OptionalName
					component={component}
					defaultValue={optionalNames[component.id]}
					onConfirm={onConfirm}
					onCancel={() => closeModal(modalId)}
					finally={() => closeModal(modalId)}
				/>
			),
		});
	}

	function handleActivityClick(component: IComponent) {
		function onConfirm(value: number) {
			const adjustedValue = Math.max(0, Math.min(component.hours, value));
			changePartial(component.id, adjustedValue);
			if (
				(adjustedValue == component.hours && !states[component.id]) ||
				(adjustedValue != component.hours && states[component.id])
			) {
				change(component.id);
			}
		}

		const modalId = openModal({
			content: (
				<ActivityProgress
					component={component}
					defaultValue={activityHours[component.id]}
					onConfirm={onConfirm}
					onCancel={() => closeModal(modalId)}
					finally={() => closeModal(modalId)}
				/>
			),
		});
	}

	async function screenshot(save: () => Promise<void>) {
		if (curriculumRef.current && progressRef.current && semestersRef.current) {
			curriculumRef.current.style.maxWidth = "none";
			curriculumRef.current.style.padding = "1rem";
			progressRef.current.style.position = "relative";
			await new Promise(requestAnimationFrame);
			await save();
			await new Promise(requestAnimationFrame);
			curriculumRef.current.style.padding = "0";
			curriculumRef.current.style.maxWidth = "100%";
			progressRef.current.style.position = "sticky";
		}
	}

	// expose data to parent
	useImperativeHandle(ref, () => ({
		reset,
		generateDump,
		curriculumRef,
		screenshot,
	}));

	return (
		<CurriculumWrapper ref={curriculumRef}>
			<SemestersList ref={semestersRef}>
				{[...semesters.entries()].map(([i, components]) =>
					i === 0 ? null : (
						<Semester key={i} $finished={components.every((c) => states[c.id]) ? "true" : "false"}>
							<p className="semester-title" onClick={() => handleChangeSemesterState(i)}>
								Semestre {i}
							</p>
							{components.map((component) => (
								<ComponentCard
									key={component.id}
									component={component}
									state={states[component.id]}
									canChange={canChange(component.id)}
									onClick={() => change(component.id)}
									optionalName={optionalNames[component.id]}
									optionalClick={
										component.type == ComponentType.OPTIONAL || component.type == ComponentType.ELECTIVE
											? () => handleOptionalClick(component)
											: undefined
									}
								/>
							))}
						</Semester>
					),
				)}
			</SemestersList>
			<ActivitiesList>
				{semesters
					.get(0)
					?.map((component) => (
						<ComponentCard
							key={component.id}
							component={component}
							state={states[component.id]}
							canChange={canChange(component.id)}
							onClick={() => handleActivityClick(component)}
							activityHours={activityHours[component.id]}
						/>
					))}
			</ActivitiesList>
			<ProgressBarContainer ref={progressRef}>
				<ProgressBar percentage={progress * 100} />
				<span className="percentage">{(progress * 100).toFixed(0)}%</span>
			</ProgressBarContainer>
		</CurriculumWrapper>
	);
});

Curriculum.displayName = "Curriculum";

export default Curriculum;
