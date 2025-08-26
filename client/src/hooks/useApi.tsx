import { useEffect, useMemo } from "react";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

import useAuth from "@/contexts/auth/useAuth";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

export default function useApi(): AxiosInstance {
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

		// Response interceptor for handling token refresh when access token is invalid
		const resInterceptor = api.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as CustomAxiosRequestConfig;

				if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
					originalRequest._retry = true;

					try {
						const refreshRes = await api.post<{ token: string }>("/auth/refresh");
						const newAccessToken = refreshRes.data.token;

						setAccessToken(newAccessToken);

						if (!originalRequest.headers) originalRequest.headers = {};
						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

						return api(originalRequest);
					} catch (refreshError) {
						await logout(); // if refresh fails
						return Promise.reject(refreshError);
					}
				}

				return Promise.reject(error);
			},
		);

		return () => {
			api.interceptors.request.eject(reqInterceptor);
			api.interceptors.response.eject(resInterceptor);
		};
	}, [accessToken, api, setAccessToken, logout]);

	return api;
}
