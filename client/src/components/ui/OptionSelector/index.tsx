import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from "react";

import { StyledLabel, StyledSelect, Wrapper } from "./styles";

export type Option = {
	label: string;
	value: string | number;
};

export interface OptionSelectorProps {
	options: Option[];
	value?: Option["value"];
	defaultValue?: Option["value"];
	onChange?: (value: Option["value"]) => void;
	className?: string;
	disabled?: boolean;
	label: string;
}

export interface OptionSelectorRef {
	focus: () => void;
	getValue: () => Option["value"] | undefined;
}

const OptionSelector = forwardRef<OptionSelectorRef, OptionSelectorProps>(
	({ options, value, defaultValue, onChange, className, disabled, label }, ref) => {
		const isControlled = value !== undefined;
		const [internalValue, setInternalValue] = useState<Option["value"] | undefined>(defaultValue);
		const selectRef = useRef<HTMLSelectElement>(null);

		const currentValue = isControlled ? value : internalValue;

		const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
			const newValue = e.target.value;
			if (!isControlled) {
				setInternalValue(newValue);
			}
			onChange?.(newValue);
		};

		useImperativeHandle(ref, () => ({
			focus: () => {
				selectRef.current?.focus();
			},
			getValue: () => {
				return currentValue;
			},
		}));

		useEffect(() => {
			if (!isControlled && defaultValue !== undefined) {
				setInternalValue(defaultValue);
			}
		}, [defaultValue, isControlled]);

		return (
			<Wrapper>
				<StyledLabel>{label}</StyledLabel>
				<StyledSelect
					ref={selectRef}
					className={className}
					value={currentValue}
					onChange={handleChange}
					disabled={disabled}
					defaultValue={-1}
				>
					<option className="default" value={-1}>
						-- Selecione --
					</option>
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</StyledSelect>
			</Wrapper>
		);
	},
);

OptionSelector.displayName = "OptionSelector";

export default OptionSelector;
