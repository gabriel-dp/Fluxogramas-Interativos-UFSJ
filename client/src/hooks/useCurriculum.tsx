import { useMemo, useState } from "react";

import { IComponent, Requisite } from "@/types/component";

function buildMap(components: IComponent[]) {
	const map = new Map<number, IComponent>();
	components.forEach((c) => map.set(c.id, c));
	return map;
}

function buildSemesters(components: IComponent[]) {
	const semesters = new Map<number, IComponent[]>();

	const max = Math.max(...components.map((c) => c.semester ?? -1));
	if (max === -1) return semesters;
	for (let i = 1; i <= max; i++) semesters.set(i, []);

	components
		.sort((a, b) => a.name.localeCompare(b.name))
		.forEach((c) => {
			if (c.semester !== null) {
				semesters.get(c.semester)?.push(c);
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

function get<K, V>(map: Map<K, V>, id: K) {
	const found = map.get(id);
	if (!found) throw new Error("Not found");
	return found;
}

export default function useCurriculum(components: IComponent[]) {
	const [states, setStates] = useState(Object.fromEntries(components.map((c) => [c.id, false])));

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

	return { components: map, states, semesters, canChange, change, get };
}
