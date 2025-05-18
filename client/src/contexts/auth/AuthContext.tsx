import { createContext, useEffect, useState } from "react";

import { IUser } from "@/types/user";
import { SignInSchema } from "@/types/auth";
import useApi from "@/hooks/useApi";

interface AuthContextI {
	user: IUser | undefined;
	token: string | undefined;
	setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
	isAuthenticated: boolean;
	login: (data: SignInSchema) => Promise<boolean>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextI>({} as AuthContextI);

export function AuthProvider(props: React.PropsWithChildren) {
	const api = useApi();
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState<string | undefined>(undefined);
	const [user, setUser] = useState<IUser | undefined>(undefined);

	async function login(data: SignInSchema) {
		try {
			const response = await api.post<{ user: IUser; token: string }>("/auth/sign-in", data);
			const { user, token } = response.data;
			setUser(user);
			setToken(token);
		} catch (error) {
			setUser(undefined);
			setToken(undefined);
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
				const response = await api.post<{ user: IUser; token: string }>("/auth/refresh", {}, { withCredentials: true });
				const { user, token } = response.data;
				setUser(user);
				setToken(token);
			} catch (err) {
				setUser(undefined);
				setToken(undefined);
			} finally {
				setLoading(false);
			}
		}

		void refresh();
	}, [api]);

	const value: AuthContextI = {
		user,
		token,
		setToken,
		isAuthenticated: !!token,
		login,
		logout,
	};

	if (loading) return null;
	return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
