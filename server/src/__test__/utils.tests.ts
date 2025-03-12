import axios, { AxiosError, AxiosResponse } from "axios";

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

export async function expectFail(status: number, func: () => Promise<AxiosResponse>) {
	let response;
	try {
		response = await func();
		fail("should fail");
	} catch (error) {
		expect((error as AxiosError).response?.status ?? response?.status).toBe(status);
	}
}
