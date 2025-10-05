import { useContext } from "react";

import { AuthContext } from "@/contexts/auth/AuthContext";

export default function useAuth() {
	return useContext(AuthContext);
}
