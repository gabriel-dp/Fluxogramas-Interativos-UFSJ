import { createContext, useEffect, useState } from "react";

import useApi from "@/hooks/useApi";

interface AuthContextI {
	token: string | undefined;
	setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
	isAuthenticated: boolean;
	login: (data: object) => Promise<boolean>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextI>({} as AuthContextI);

export function AuthProvider(props: React.PropsWithChildren) {
	const api = useApi();
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState<string | undefined>(undefined);

	async function login(data: object) {
		try {
			const response = await api.post<{ token: string }>("/auth/sign-in", data);
			const { token } = response.data;
			setToken(token);
		} catch (error) {
			return false;
		}
		return true;
	}

	async function logout() {
		await api.post("/auth/logout");
		setToken(undefined);
	}

	useEffect(() => {
		async function refresh() {
			try {
				const response = await api.post<{ token: string }>("/auth/refresh", {}, { withCredentials: true });
				setToken(response.data.token);
			} catch (err) {
				setToken(undefined);
			} finally {
				setLoading(false);
			}
		}

		void refresh();
	}, [api]);

	const value: AuthContextI = {
		token,
		setToken,
		isAuthenticated: !!token,
		login,
		logout,
	};

	if (loading) return null;
	return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
