export const normalizeString = (str: string) =>
	str
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "");
