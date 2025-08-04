import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import useCourseService from "@/services/courseService";
import { ICourse } from "@/types/course";
import { IUser } from "@/types/user";
import EntityForm from "@/components/EntityForm";
import Checkbox from "@/components/ui/Checkbox";
import { CheckboxList } from "@/components/ui/Checkbox/styles";

interface UserPermissionFormProps {
	selectedUser: IUser | null | undefined;
}

export default function UserPermissionForm(props: UserPermissionFormProps) {
	const { readAll, readAllByUser, saveUserCourses } = useCourseService();
	const [allCourses, setAllCourses] = useState<ICourse[]>([]);

	const { handleSubmit, reset, control } = useForm<{ courseIds: number[] }>({
		defaultValues: {
			courseIds: [],
		},
	});

	useEffect(() => {
		async function requestCourses() {
			if (props.selectedUser && !props.selectedUser.isAdmin) {
				setAllCourses(await readAll());
				const allCoursesByUser = await readAllByUser(props.selectedUser.id);
				reset({ courseIds: allCoursesByUser.map((c) => c.id) });
			}
		}

		void requestCourses();
	}, [props.selectedUser, readAll, readAllByUser, reset]);

	if (!props.selectedUser || props.selectedUser.isAdmin) return null;

	async function onSubmit(data: object) {
		if (props.selectedUser) {
			await saveUserCourses(props.selectedUser.id, data);
		}
	}

	return (
		<EntityForm
			entity="Permissões do Usuário"
			selectedEntity={props.selectedUser}
			onSubmit={(e) => {
				void handleSubmit(onSubmit)();
				e.preventDefault();
			}}
		>
			<Controller
				name="courseIds"
				control={control}
				render={({ field }) => (
					<CheckboxList>
						{allCourses.map((course) => (
							<Checkbox
								key={course.id}
								label={course.name}
								value={course.id}
								checked={field.value.includes(course.id)}
								onChange={(e) => {
									const newValue = e.target.checked
										? [...field.value, course.id]
										: field.value.filter((val) => val !== course.id);
									field.onChange(newValue);
								}}
							/>
						))}
					</CheckboxList>
				)}
			/>
		</EntityForm>
	);
}
