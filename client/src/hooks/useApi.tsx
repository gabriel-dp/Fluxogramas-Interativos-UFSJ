import { useEffect, useMemo } from "react";
import axios, { AxiosInstance } from "axios";

import { useAuth } from "@/contexts/auth/useAuth";

export default function useApi(): AxiosInstance {
	const { token: accessToken, setToken: setAccessToken, logout } = useAuth();

	const api = useMemo(() => {
		if (import.meta.env.VITE_API_URL == undefined) throw Error("API URL env variable not set");
		return axios.create({
			baseURL: import.meta.env.VITE_API_URL,
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
			(res) => res,
			async (error) => {
				const originalRequest = error.config;

				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;

					try {
						const refreshRes = await api.post("/auth/refresh");
						const newAccessToken = refreshRes.data.accessToken;

						setAccessToken(newAccessToken);

						originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
						return api(originalRequest);
					} catch (refreshError) {
						logout(); // if refresh fails
						return Promise.reject(refreshError);
					}
				}

				return Promise.reject(error);
			}
		);

		return () => {
			api.interceptors.request.eject(reqInterceptor);
			api.interceptors.response.eject(resInterceptor);
		};
	}, [accessToken, api, setAccessToken, logout]);

	return api;
}
