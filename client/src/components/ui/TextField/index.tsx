import React, { useState, forwardRef } from "react";

import { InputWrapper, StyledInput, StyledLabel, Wrapper } from "./styles";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
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

	const isFloating = focused || filled || !!value;

	console.log(value);

	return (
		<Wrapper>
			<InputWrapper>
				<StyledInput {...props} ref={ref} value={value} onFocus={handleFocus} onBlur={handleBlur} />
				<StyledLabel isFloating={isFloating}>{label}</StyledLabel>
			</InputWrapper>
		</Wrapper>
	);
});

TextField.displayName = "TextField";

export default TextField;
