export type Credentials = {
	login: string;
	password: string;
	isAdmin: boolean;
};

export const ADMIN_CREDENTIALS: Credentials = {
	login: "admin",
	password: "@admin123",
	isAdmin: true,
};

export const NORMAL_CREDENTIALS: Credentials = {
	login: "login",
	password: "12345678",
	isAdmin: false,
};

export function generateString(length: number, char = "0"): string {
	return char.repeat(length);
}

export function generateUniqueLogin() {
	return `login${process.hrtime.bigint()}`;
}

export function generateValidPassword() {
	const randomNumber = Math.floor(Math.random() * 10);
	return generateString(8, String(randomNumber));
}

export function generateNewUserData(): Credentials {
	return {
		login: generateUniqueLogin(),
		password: generateValidPassword(),
		isAdmin: false,
	};
}
