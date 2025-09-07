import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import useNotifications from "@/contexts/notifications/useNotifications";
import useCourseService from "@/services/courseService";
import { ICourseComplete } from "@/types/course";
import { IUser } from "@/types/user";
import EntityForm from "@/components/EntityForm";
import Checkbox from "@/components/ui/Checkbox";
import { CheckboxList } from "@/components/ui/Checkbox/styles";

interface UserPermissionFormProps {
	selectedUser: IUser | null | undefined;
}

export default function UserPermissionForm(props: UserPermissionFormProps) {
	const { addNotification } = useNotifications();
	const { readAll, readAllByUser, saveUserCourses } = useCourseService();
	const [allCourses, setAllCourses] = useState<ICourseComplete[]>([]);

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
			addNotification({ type: "success", message: `Permissões atualizadas (Usuário ${props.selectedUser.id})` });
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
			hideEntityId
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
