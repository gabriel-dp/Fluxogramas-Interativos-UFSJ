import { createContext, PropsWithChildren } from "react";

import useStoredState from "@/hooks/useStoredState";
import { darkThemePreferred } from "@/utils/browserUtils";

interface StoredConfigs {
	darkMode: boolean;
}

interface ConfigsContextI extends StoredConfigs {
	toggleTheme: () => void;
}

export const ConfigsContext = createContext<ConfigsContextI>({} as ConfigsContextI);

export function ConfigsProvider(props: PropsWithChildren) {
	const [configs, setConfigs] = useStoredState<StoredConfigs>("configs", {
		darkMode: darkThemePreferred(),
	});

	const toggleTheme = () => {
		setConfigs((config) => ({
			...config,
			darkMode: !config.darkMode,
		}));
	};

	return <ConfigsContext.Provider value={{ ...configs, toggleTheme }}>{props.children}</ConfigsContext.Provider>;
}
