import { useMemo, useState } from "react";

import { ComponentType, IComponent, Requisite } from "@/types/component";

function buildMap(components: IComponent[]) {
	const map = new Map<number, IComponent>();
	components.forEach((c) => map.set(c.id, c));
	return map;
}

function buildSemesters(components: IComponent[]) {
	const semesters = new Map<number, IComponent[]>();

	const max = Math.max(...components.map((c) => c.semester ?? 0)); // 0 when there are no components
	for (let i = 0; i <= max; i++) semesters.set(i, []);

	const orderType = {
		[ComponentType.SUBJECT]: 1,
		[ComponentType.OPTIONAL]: 2,
		[ComponentType.ELECTIVE]: 3,
		[ComponentType.ACTIVITY]: 4,
	};

	components
		.sort((a, b) => {
			if (a.type == b.type) return a.name.localeCompare(b.name);
			return orderType[a.type] - orderType[b.type];
		})
		.forEach((c) => {
			if (c.semester !== null) {
				semesters.get(c.semester)?.push(c);
			} else {
				semesters.get(0)?.push(c);
			}
		});

	return semesters;
}

function buildDependents(components: IComponent[]) {
	const dependents = new Map<number, Requisite[]>();

	for (const comp of components) {
		dependents.set(comp.id, []);
	}

	for (const comp of components) {
		for (const req of comp.requisites) {
			const arr = dependents.get(req.id);
			if (arr) arr.push({ id: comp.id, corequisite: req.corequisite });
		}
	}

	return dependents;
}

function get<K, V>(map: Map<K, V>, id: K): NonNullable<V> {
	const found = map.get(id);
	if (found == undefined) throw new Error(`Not found ${id as string}`);
	return found;
}

export interface useCurriculumReturn {
	components: Map<number, IComponent>;
	semesters: Map<number, IComponent[]>;
	states: {
		[k: string]: boolean;
	};
	activityHours: {
		[k: string]: number;
	};
	optionalNames: {
		[k: string]: string;
	};
	canChange: (id: number) => boolean;
	change: (id: number) => void;
	changePartial: (id: number, value: number) => void;
	changeName: (id: number, value: string) => void;
	reset: () => void;
}

export default function useCurriculum(components: IComponent[]): useCurriculumReturn {
	function newStates() {
		return Object.fromEntries(components.map((c) => [c.id, false]));
	}
	function newActivityHours() {
		return Object.fromEntries(components.filter((c) => c.type == ComponentType.ACTIVITY).map((c) => [c.id, 0]));
	}
	function newOptionalNames() {
		return Object.fromEntries(
			components
				.filter((c) => c.type == ComponentType.OPTIONAL || c.type == ComponentType.ELECTIVE)
				.map((c) => [c.id, c.name]),
		);
	}

	const [states, setStates] = useState(newStates());
	const [activityHours, setActivityHours] = useState(newActivityHours());
	const [optionalNames, setOptionalNames] = useState(newOptionalNames());

	const map = useMemo(() => buildMap(components), [components]);
	const semesters = useMemo(() => buildSemesters(components), [components]);
	const dependency = useMemo(() => buildDependents(components), [components]);

	function canChange(id: number) {
		// Verify if it is not being required by active components
		for (const descendant of get(dependency, id)) {
			if (!descendant.corequisite && states[descendant.id]) {
				return false;
			}
		}

		// Verify if all requisites are satisfied
		for (const ancestor of get(map, id).requisites) {
			if (
				(!ancestor.corequisite && !states[ancestor.id]) ||
				(ancestor.corequisite && !(states[ancestor.id] || canChange(ancestor.id)))
			) {
				return false;
			}
		}

		return true;
	}

	function change(id: number) {
		if (canChange(id)) {
			setStates((prev) => ({ ...prev, [id]: !prev[id] }));
		}
	}

	function changePartial(id: number, value: number) {
		if (canChange(id)) {
			setActivityHours((prev) => ({ ...prev, [id]: value }));
		}
	}

	function changeName(id: number, value: string) {
		setOptionalNames((prev) => ({ ...prev, [id]: value }));
	}

	function reset() {
		setStates(newStates());
		setActivityHours(newActivityHours());
		setOptionalNames(newOptionalNames());
	}

	return {
		components: map,
		semesters,
		states,
		activityHours,
		optionalNames,
		canChange,
		change,
		changePartial,
		changeName,
		reset,
	};
}
