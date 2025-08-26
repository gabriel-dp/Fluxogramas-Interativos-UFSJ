import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	return {
		server: {
			host: "0.0.0.0",
			port: parseInt(env.VITE_PORT) || 5173,
		},
		plugins: [react(), tsconfigPaths()],
	};
});
