import { useContext } from "react";

import { ConfigsContext } from "@/contexts/configs";

export default function useConfigs() {
	return useContext(ConfigsContext);
}
