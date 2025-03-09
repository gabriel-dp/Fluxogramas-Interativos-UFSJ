import axios, { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";

import { userSignInSchema } from "@/models/user.model";

export type Credentials = z.infer<typeof userSignInSchema>;

export const api = axios.create({
	baseURL: process.env.API_URL,
});

export function fail(message: string) {
	throw new Error(message);
}

export async function expectSuccess(status: number, func: () => Promise<AxiosResponse>) {
	try {
		const response = await func();
		expect(response.status).toBe(status);
		return response;
	} catch (error) {
		fail(`should success, expect ${status}, got ${(error as AxiosError).response?.status}`);
	}
}

export async function expectFail(status: number, func: () => Promise<void>) {
	try {
		await func();
		fail("should fail");
	} catch (error) {
		expect((error as AxiosError).response?.status).toBe(status);
	}
}

export async function signInToken(credentials: Credentials) {
	const response = await api.post("auth/sign-in", credentials);
	if (!response.data.token) throw new Error("Failed to retrieve token");
	return response.data.token;
}
