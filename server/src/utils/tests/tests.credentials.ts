import AuthService from "#src/modules/auth/auth.service";
import { IUser } from "#src/modules/user/user.model";

export type Credentials = {
	username: string;
	password: string;
	isAdmin: boolean;
};

export const ADMIN_CREDENTIALS: Credentials = {
	username: "admin",
	password: "@admin123",
	isAdmin: true,
};

export const NORMAL_CREDENTIALS: Credentials = {
	username: "username",
	password: "12345678",
	isAdmin: false,
};

export function generateString(length: number, char = "0"): string {
	return char.repeat(length);
}

export function generateUniqueUsername() {
	return `username${process.hrtime.bigint()}`;
}

export function generateValidPassword() {
	const randomNumber = Math.floor(Math.random() * 10);
	return generateString(8, String(randomNumber));
}

export function generateNewUserData(): Credentials {
	return {
		username: generateUniqueUsername(),
		password: generateValidPassword(),
		isAdmin: false,
	};
}

export async function signIn(
	credentials: Pick<Credentials, "username" | "password">,
): Promise<IUser & { token: string }> {
	const { user, accessToken } = await AuthService.signIn({
		username: credentials.username,
		password: credentials.password,
	});
	return { ...user, token: accessToken };
}
