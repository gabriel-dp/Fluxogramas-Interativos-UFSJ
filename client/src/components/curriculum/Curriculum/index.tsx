import { forwardRef, RefObject, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

import { ICourseComponents } from "@/types/course";
import { ComponentType, IComponent } from "@/types/component";
import useModal from "@/contexts/modal/useModal";
import useCurriculum, { CurriculumDump } from "@/hooks/useCurriculum";
import ComponentCard from "@/components/curriculum/ComponentCard";
import ProgressBar from "@/components/curriculum/ProgressBar";
import ActivityProgress from "@/components/layout/Modals/components/ActivityProgress";
import OptionalName from "@/components/layout/Modals/components/OptionalName";

import {
	ActivitiesList,
	CurriculumWrapper,
	FocusOverflow,
	ProgressBarContainer,
	Semester,
	SemestersList,
} from "./styles";

interface CurriculumProps {
	course: ICourseComponents;
	onChange?: () => void;
}

export type CurriculumHandle = {
	reset: (dump?: CurriculumDump) => void;
	generateDump: () => CurriculumDump;
	curriculumRef: RefObject<HTMLDivElement>;
	screenshot: (save: () => Promise<void>) => Promise<void>;
};

const Curriculum = forwardRef<CurriculumHandle, CurriculumProps>((props, ref) => {
	const {
		components,
		dependency,
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
	} = useCurriculum(props.course.components);
	const { openModal, closeModal } = useModal();
	const curriculumRef = useRef<HTMLDivElement>(null);
	const semestersRef = useRef<HTMLDivElement>(null);
	const progressRef = useRef<HTMLDivElement>(null);

	const componentRefs = useRef<Record<string, HTMLDivElement | null>>({});
	const [focus, setFocus] = useState(false);

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
					finished += activityHours[c.id] != undefined ? activityHours[c.id] : 0;
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

	function focusComponent(id: number) {
		if (focus) return;
		props.course.components.forEach((c) => {
			if (
				c.id !== id &&
				!components.get(id)?.requisites.find((r) => r.id == c.id) &&
				!dependency.get(id)?.find((r) => r.id == c.id)
			) {
				const componentRef = componentRefs.current[c.id];
				if (componentRef) {
					componentRef.style.filter = "blur(5px)";
					componentRef.style.opacity = "0.5";
				}
			}
		});
		setFocus(true);
	}
	function unfocusComponent() {
		if (!focus) return;
		props.course.components.forEach((c) => {
			const componentRef = componentRefs.current[c.id];
			if (componentRef) {
				componentRef.style.filter = "none";
				componentRef.style.opacity = "1";
			}
		});
		setFocus(false);
	}

	function generateComponent(component: IComponent) {
		function onClick() {
			if (component.type == ComponentType.ACTIVITY) {
				handleActivityClick(component);
			} else {
				if (!change(component.id)) focusComponent(component.id);
			}
		}

		return (
			<ComponentCard
				key={component.id}
				component={component}
				state={states[component.id]}
				canChange={canChange(component.id)}
				onClick={onClick}
				activityHours={activityHours[component.id]}
				optionalName={optionalNames[component.id]}
				optionalClick={
					component.type == ComponentType.OPTIONAL || component.type == ComponentType.ELECTIVE
						? () => handleOptionalClick(component)
						: undefined
				}
				focusClick={() => focusComponent(component.id)}
				$ref={(el) => (componentRefs.current[component.id] = el)}
			/>
		);
	}

	// expose data to parent
	useImperativeHandle(
		ref,
		() => ({
			reset,
			generateDump,
			curriculumRef,
			screenshot,
		}),
		[reset, generateDump],
	);

	useEffect(() => {
		if (props.onChange) props.onChange();
	}, [props, states, activityHours, optionalNames]);

	return (
		<CurriculumWrapper ref={curriculumRef}>
			<FocusOverflow
				$on={focus ? "true" : "false"}
				onPointerDown={(e) => {
					e.stopPropagation();
					unfocusComponent();
				}}
			/>
			<SemestersList ref={semestersRef}>
				{[...semesters.entries()].splice(1).map(([i, components]) =>
					i === 0 ? null : (
						<Semester key={i} $finished={components.every((c) => states[c.id]) ? "true" : "false"}>
							<p className="semester-title" onClick={() => handleChangeSemesterState(i)}>
								Semestre {i}
							</p>
							{components.map((c) => generateComponent(c))}
						</Semester>
					),
				)}
			</SemestersList>
			<ActivitiesList>{semesters.get(0)?.map((c) => generateComponent(c))}</ActivitiesList>
			<ProgressBarContainer ref={progressRef}>
				<ProgressBar percentage={progress * 100} />
				<span className="percentage">{(progress * 100).toFixed(0)}%</span>
			</ProgressBarContainer>
		</CurriculumWrapper>
	);
});

Curriculum.displayName = "Curriculum";

export default Curriculum;
