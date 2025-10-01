import { useNavigate, useLocation } from "react-router-dom";
import {
	FaSlidersH as MainIcon,
	FaSun as LightIcon,
	FaMoon as DarkIcon,
	FaUserLock as AuthIcon,
	FaHome as HomeIcon,
} from "react-icons/fa";
import { MdOutlineLogout as LogoutIcon } from "react-icons/md";

import { Routes } from "@/routes";
import useConfigs from "@/contexts/configs/useConfigs";
import useAuth from "@/contexts/auth/useAuth";

import { ButtonsStack, MainButton, SecondaryButton } from "./styles";

export default function ActionButtons() {
	const location = useLocation();
	const navigate = useNavigate();
	const { isAuthenticated, logout } = useAuth();
	const { darkMode, toggleTheme } = useConfigs();

	function isAuthPage() {
		const path = location.pathname;
		return path.startsWith(Routes.dashboard) || path == Routes.signIn;
	}

	function handleAuthButton() {
		if (!isAuthPage()) {
			if (isAuthenticated) {
				navigate(Routes.dashboard);
			} else {
				navigate(Routes.signIn);
			}
		} else {
			navigate(Routes.home);
		}
	}

	async function handleLogout() {
		if (isAuthenticated) {
			await logout();
			navigate(Routes.home);
		}
	}

	// prettier-ignore
	const buttons = [
		<SecondaryButton key="theme" onClick={toggleTheme}>
			{!darkMode ? <DarkIcon className="icon" /> : <LightIcon className="icon" />}
		</SecondaryButton>,
		<SecondaryButton key="auth" onClick={handleAuthButton}>
			{!isAuthPage() ? <AuthIcon className="icon"/> : <HomeIcon className="icon"/>}
		</SecondaryButton>,
		...(isAuthenticated ? [
			<SecondaryButton key="logout" onClick={() => void handleLogout()}>
				<LogoutIcon className="icon"/>
			</SecondaryButton>
		] : []),
	];

	return (
		<ButtonsStack quantity={buttons.length}>
			<MainButton>
				<MainIcon />
			</MainButton>
			{buttons.map((button) => button)}
		</ButtonsStack>
	);
}
