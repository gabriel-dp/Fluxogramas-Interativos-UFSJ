import { createContext, useState } from "react";

import useApi from "@/hooks/useApi";

interface AuthContextI {
	username: string | undefined;
	token: string | undefined;
	setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
	isAuthenticated: boolean;
	login(data: object): Promise<boolean>;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextI>({} as AuthContextI);

export function AuthProvider(props: React.PropsWithChildren) {
	const [token, setToken] = useState<string | undefined>(undefined);
	const [username, setUsername] = useState<string | undefined>(undefined);
	const api = useApi();

	async function login(data: object) {
		try {
			const response = await api.post("/auth/sign-in", data);
			const { token, login: username } = response.data;
			setToken(token);
			setUsername(username);
		} catch (error) {
			return false;
		}
		return true;
	}

	async function logout() {
		await api.post("/auth/logout");
		setUsername(undefined);
		setToken(undefined);
	}

	const value: AuthContextI = {
		username,
		token,
		setToken,
		isAuthenticated: !!token,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
