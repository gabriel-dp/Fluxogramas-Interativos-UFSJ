import { useContext } from "react";

import { ConfigsContext } from "@/contexts/configs/ConfigsContext";

export default function useConfigs() {
	return useContext(ConfigsContext);
}
