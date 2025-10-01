import { useEffect, useMemo, useRef } from "react";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

import useAuth from "@/contexts/auth/useAuth";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

export default function useApi(): AxiosInstance {
	const refreshingRef = useRef(false);
	const { token: accessToken, setToken: setAccessToken, logout } = useAuth();

	const api = useMemo(() => {
		const baseURL = import.meta.env.VITE_API_URL as string;
		if (!baseURL) throw new Error("API URL env variable not set");

		return axios.create({
			baseURL,
			withCredentials: true,
		});
	}, []);

	useEffect(() => {
		// Request interceptor to insert access token in all requests
		const reqInterceptor = api.interceptors.request.use((config) => {
			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			return config;
		});

		return () => {
			api.interceptors.request.eject(reqInterceptor);
		};
	}, [accessToken, api]);

	useEffect(() => {
		// Response interceptor for handling token refresh when access token is invalid
		const resInterceptor = api.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const originalRequest = { ...error.config } as CustomAxiosRequestConfig;

				if ((error.response?.status === 401 || error.response?.status === 403) && !refreshingRef.current) {
					try {
						refreshingRef.current = true;

						const refreshRes = await api.post<{ token: string }>("/auth/refresh");
						const newAccessToken = refreshRes.data.token;
						setAccessToken(newAccessToken);

						if (!originalRequest.headers) originalRequest.headers = {};
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

						return api(originalRequest);
					} catch (refreshError) {
						await logout(); // if refresh fails
						return Promise.reject(refreshError);
					} finally {
						refreshingRef.current = false;
					}
				}

				return Promise.reject(error);
			},
		);

		return () => {
			api.interceptors.response.eject(resInterceptor);
		};
	}, [api, setAccessToken, logout]);

	return api;
}
