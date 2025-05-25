import React, { useState, useRef, useEffect } from "react";
import { InputWrapper, StyledInput, StyledLabel, Wrapper } from "./styles";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, value, ...props }) => {
	const [focused, setFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const isFloating = focused || !!value;

	useEffect(() => {
		if (inputRef.current && document.activeElement === inputRef.current) {
			setFocused(true);
		}
	}, []);

	return (
		<Wrapper>
			<InputWrapper>
				<StyledInput
					{...props}
					ref={inputRef}
					value={value}
					onFocus={(e) => {
						setFocused(true);
						props.onFocus?.(e);
					}}
					onBlur={(e) => {
						setFocused(false);
						props.onBlur?.(e);
					}}
				/>
				<StyledLabel isFloating={isFloating}>{label}</StyledLabel>
			</InputWrapper>
		</Wrapper>
	);
};

export default TextField;
