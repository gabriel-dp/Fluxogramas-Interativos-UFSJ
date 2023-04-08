import { useState, useEffect } from "react";

export default function useLocalStorage(key: string, initialValue?: object) {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			if (storedValue === undefined) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, JSON.stringify(storedValue));
			}
		} catch (error) {
			console.error(error);
		}
	}, [key, storedValue]);

	const setValue = (value: object) => setStoredValue(value);

	return [storedValue, setValue];
}
