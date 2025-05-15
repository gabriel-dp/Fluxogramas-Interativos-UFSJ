import { createContext } from "react";

import useConfigs from "@/hooks/useConfigs";

interface AuthContextI {
	token: string | null;
	isAuthenticated: boolean;
	login: (token: string) => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextI>({} as AuthContextI);

export function AuthProvider(props: React.PropsWithChildren) {
	const { token, changeConfigs } = useConfigs();

	const login = (newToken: string) => {
		changeConfigs((configs) => ({ ...configs, token: newToken }));
	};

	const logout = () => {
		changeConfigs((configs) => ({ ...configs, token: null }));
	};

	const value: AuthContextI = {
		token,
		isAuthenticated: !!token,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
