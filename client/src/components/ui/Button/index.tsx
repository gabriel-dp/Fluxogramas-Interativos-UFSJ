import React from "react";

import { StyledButton } from "./styles";

export type ButtonCategory = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	category?: ButtonCategory;
}

const Button: React.FC<ButtonProps> = ({ children, category = "primary", ...props }) => {
	return (
		<StyledButton $category={category} {...props}>
			{children}
		</StyledButton>
	);
};

export default Button;
