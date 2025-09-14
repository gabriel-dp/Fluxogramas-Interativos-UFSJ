import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useCourseService from "@/services/courseService";
import useCourseTypeService from "@/services/courseTypeService";
import useCourseShiftService from "@/services/courseShiftService";
import useCourseCampusService from "@/services/courseCampusService";
import { createCourseSchema, ICourseComplete } from "@/types/course";
import { IType } from "@/types/course-attributes/type";
import { IShift } from "@/types/course-attributes/shift";
import { ICampus } from "@/types/course-attributes/campus";
import TextField from "@/components/ui/TextField";
import OptionSelector from "@/components/ui/OptionSelector";
import EntityForm from "@/components/EntityForm";
import useNotifications from "@/contexts/notifications/useNotifications";
import { ConflictException } from "@/utils/exceptionUtils";
import useModal from "@/contexts/modal/useModal";
import AreYouSureToDelete from "@/components/Modals/AreYouSureToDelete";

interface CourseFormFields {
	code: string;
	name: string;
	typeId: number;
	shiftId: number;
	campusId: number;
}

interface CourseFormI {
	selectedCourse: ICourseComplete | null | undefined;
	refresh: () => void;
}

export default function CourseForm(props: CourseFormI) {
	const { addNotification } = useNotifications();
	const { openModal, closeModal } = useModal();
	const { createOne, updateOne, deleteOne } = useCourseService();
	const { readAll: readAllTypes } = useCourseTypeService();
	const { readAll: readAllShifts } = useCourseShiftService();
	const { readAll: readAllCampus } = useCourseCampusService();

	const {
		control,
		reset,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm<CourseFormFields>({
		defaultValues: {
			code: "",
			name: "",
			typeId: -1,
			shiftId: -1,
			campusId: 1,
		},
		resolver: zodResolver(createCourseSchema),
	});

	// Get course attributes
	const [loading, setLoading] = useState(true);
	const [allTypes, setAllTypes] = useState<IType[]>([]);
	const [allShifts, setAllShifts] = useState<IShift[]>([]);
	const [allCampus, setAllCampus] = useState<ICampus[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const [types, shifts, campus] = await Promise.all([readAllTypes(), readAllShifts(), readAllCampus()]);
			setAllTypes(types);
			setAllShifts(shifts);
			setAllCampus(campus);
			setLoading(false);
		};
		void fetchData();
	}, [readAllTypes, readAllShifts, readAllCampus]);

	useEffect(() => {
		if (props.selectedCourse) {
			reset({
				code: props.selectedCourse.code,
				name: props.selectedCourse.name,
				typeId: props.selectedCourse.type.id,
				shiftId: props.selectedCourse.shift.id,
				campusId: props.selectedCourse.campus.id,
			});
		} else if (props.selectedCourse === null) {
			reset({
				code: "",
				name: "",
				typeId: 0,
				shiftId: 0,
				campusId: 0,
			});
		}
	}, [props.selectedCourse, reset]);

	if (props.selectedCourse === undefined || loading) return null;

	async function onSubmit(data: CourseFormFields) {
		data = { ...data, campusId: Number(data.campusId), shiftId: Number(data.shiftId), typeId: Number(data.typeId) }; // Fix selector value types

		try {
			if (props.selectedCourse) {
				await updateOne(props.selectedCourse.id, data);
				addNotification({ type: "success", message: `Curso #${props.selectedCourse.id} atualizado com sucesso` });
			} else {
				const { id } = await createOne(data);
				addNotification({ type: "success", message: `Curso #${id} criado com sucesso` });
			}
		} catch (error) {
			if (error instanceof ConflictException) {
				setError("code", { message: "Código em uso" });
			}
			throw error;
		}

		props.refresh();
	}

	function onDelete() {
		async function onConfirm() {
			if (props.selectedCourse) {
				await deleteOne(props.selectedCourse.id);
				addNotification({ type: "success", message: `Curso #${props.selectedCourse.id} deletado` });
			}
			props.refresh();
		}
		const modalId = openModal({
			content: (
				<AreYouSureToDelete
					onConfirm={onConfirm}
					onCancel={() => closeModal(modalId)}
					finally={() => closeModal(modalId)}
				/>
			),
		});
	}

	return (
		<EntityForm
			entity="Curso"
			selectedEntity={props.selectedCourse}
			onSubmit={(e) => {
				void handleSubmit(onSubmit)();
				e.preventDefault();
			}}
			onDelete={onDelete}
			hasError={!isValid}
		>
			<div className="row">
				<Controller
					name="code"
					control={control}
					render={({ field }) => <TextField label="Código*" {...field} required error={errors.code?.message} />}
				/>
				<Controller
					name="name"
					control={control}
					render={({ field }) => <TextField label="Nome*" {...field} required error={errors.name?.message} />}
				/>
			</div>
			<div className="row">
				<Controller
					name="typeId"
					control={control}
					render={({ field }) => (
						<OptionSelector label="Tipo*" options={allTypes.map((t) => ({ value: t.id, label: t.name }))} {...field} />
					)}
				/>
				<Controller
					name="shiftId"
					control={control}
					render={({ field }) => (
						<OptionSelector
							label="Turno*"
							options={allShifts.map((s) => ({ value: s.id, label: s.name }))}
							{...field}
						/>
					)}
				/>
				<Controller
					name="campusId"
					control={control}
					render={({ field }) => (
						<OptionSelector
							label="Campus*"
							options={allCampus.map((c) => ({ value: c.id, label: c.name }))}
							{...field}
						/>
					)}
				/>
			</div>
		</EntityForm>
	);
}
