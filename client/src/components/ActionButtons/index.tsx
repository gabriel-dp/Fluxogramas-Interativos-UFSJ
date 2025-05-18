import { useNavigate } from "react-router-dom";
import { FaSlidersH as MainIcon, FaSun as LightIcon, FaMoon as DarkIcon, FaUserLock as AuthIcon } from "react-icons/fa";

import { Routes } from "@/routes";
import useConfigs from "@/contexts/configs/useConfigs";

import { ButtonsStack, MainButton, SecondaryButton } from "./styles";

export default function ActionButtons() {
	const { darkMode, toggleTheme } = useConfigs();

	const navigate = useNavigate();
	function goToAuth() {
		navigate(Routes.signIn);
	}

	const buttons = [
		<SecondaryButton key="theme" onClick={toggleTheme}>
			{!darkMode ? <DarkIcon className="icon" /> : <LightIcon className="icon" />}
		</SecondaryButton>,
		<SecondaryButton key="auth" onClick={goToAuth}>
			<AuthIcon />
		</SecondaryButton>,
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
