import { AxiosRequestConfig } from "axios";

import { api } from "./utils.tests";

export type Credentials = {
	login?: string;
	password?: string;
	isAdmin?: boolean;
};

export function authHeaders(token?: string): AxiosRequestConfig<Credentials> {
	const headers = {
		headers: {
			authorization: `Bearer ${token}`,
		},
	};
	return headers;
}

export async function register(credentials: Credentials, token?: string) {
	const response = await api.post("/auth/register", credentials, token ? authHeaders(token) : undefined);
	return response;
}

export async function signIn(credentials: Credentials) {
	const response = await api.post("auth/sign-in", credentials);
	return response;
}

export function generateString(length: number, char = "a"): string {
	return char.repeat(length);
}

export function generateUniqueLogin() {
	return `login${process.hrtime.bigint()}`;
}

export function generateValidPassword() {
	return generateString(8);
}

export function generateNewUserData(): Credentials {
	return {
		login: generateUniqueLogin(),
		password: generateValidPassword(),
	};
}
