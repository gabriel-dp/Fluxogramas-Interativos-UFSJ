import { useContext } from "react";

import { ConfigsContext } from ".";

export default function useConfigs() {
	const context = useContext(ConfigsContext);
	return context;
}
