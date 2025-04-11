import { useEffect, useState } from "react";

type StoredStateHookReturn<T> = [T, (newValue: T | ((previousValue: T) => T)) => void];

export default function useStoredState<T extends object>(key: string, initialValue: T): StoredStateHookReturn<T> {
	const [value, setValue] = useState<T>(() => {
		const storedValue = localStorage.getItem(key);
		const initial = storedValue ? JSON.parse(storedValue) : initialValue;
		return initial;
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
}
