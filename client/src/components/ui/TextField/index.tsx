import React, { useState, forwardRef } from "react";

import ErrorText from "@/components/ui/ErrorText";

import { InputWrapper, StyledInput, StyledLabel, Wrapper } from "./styles";

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> {
	label: string;
	value: string | number | undefined | null;
	error?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ label, value, onFocus, onBlur, ...props }, ref) => {
	const [focused, setFocused] = useState(false);
	const [filled, setFilled] = useState(false);

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setFocused(false);
		setFilled(!!e.target.value);
		onBlur?.(e);
	};

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		setFocused(true);
		onFocus?.(e);
	};

	const isFloating = focused || filled || (value !== "" && value !== undefined && value !== null);

	return (
		<Wrapper>
			<InputWrapper>
				<StyledInput
					{...props}
					ref={ref}
					value={value ?? (value === null ? "" : undefined)}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
				<StyledLabel isFloating={isFloating}>{label}</StyledLabel>
				<ErrorText error={props.error} />
			</InputWrapper>
		</Wrapper>
	);
});

TextField.displayName = "TextField";

export default TextField;
