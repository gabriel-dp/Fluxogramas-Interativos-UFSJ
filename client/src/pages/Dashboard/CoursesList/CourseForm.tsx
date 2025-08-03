import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import useCourseService from "@/services/courseService";
import useCourseTypeService from "@/services/courseTypeService";
import useCourseShiftService from "@/services/courseShiftService";
import useCourseCampusService from "@/services/courseCampusService";
import { ICourse } from "@/types/course";
import { IType } from "@/types/course-attributes/type";
import { IShift } from "@/types/course-attributes/shift";
import { ICampus } from "@/types/course-attributes/campus";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";

import { DashboardForm } from "../styles";
import OptionSelector from "@/components/ui/OptionSelector";

interface CourseFormFields {
	code: string;
	name: string;
	typeId: number;
	shiftId: number;
	campusId: number;
}

interface CourseFormI {
	selectedCourse: ICourse | null | undefined;
	refresh: () => void;
}

export default function CourseForm(props: CourseFormI) {
	const { createOne, updateOne, deleteOne } = useCourseService();
	const { readAll: readAllTypes } = useCourseTypeService();
	const { readAll: readAllShifts } = useCourseShiftService();
	const { readAll: readAllCampus } = useCourseCampusService();

	const { control, reset, handleSubmit } = useForm<CourseFormFields>({
		defaultValues: {
			code: "",
			name: "",
			typeId: -1,
			shiftId: -1,
			campusId: 1,
		},
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
				typeId: props.selectedCourse.typeId,
				shiftId: props.selectedCourse.shiftId,
				campusId: props.selectedCourse.campusId,
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
		if (props.selectedCourse) {
			await updateOne(props.selectedCourse.id, data);
		} else {
			await createOne(data);
		}
		props.refresh();
	}

	async function onDelete() {
		if (props.selectedCourse) {
			await deleteOne(props.selectedCourse.id);
		}
		props.refresh();
	}

	return (
		<DashboardForm
			onSubmit={(e) => {
				void handleSubmit(onSubmit)();
				e.preventDefault();
			}}
		>
			{props.selectedCourse ? <h2>Editar Curso ({props.selectedCourse.id})</h2> : <h2>Novo Curso</h2>}
			<div>
				<Controller
					name="code"
					control={control}
					render={({ field }) => <TextField label="Código*" {...field} required />}
				/>
				<Controller
					name="name"
					control={control}
					render={({ field }) => <TextField label="Nome*" {...field} required />}
				/>
			</div>
			<div>
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
			{props.selectedCourse ? (
				<div>
					<Button type="submit">Salvar</Button>
					<Button onClick={() => void onDelete()} category="secondary">
						Deletar
					</Button>
				</div>
			) : (
				<div>
					<Button type="submit">Criar</Button>
				</div>
			)}
		</DashboardForm>
	);
}
