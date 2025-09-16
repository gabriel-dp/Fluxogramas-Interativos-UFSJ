import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from "react";

import ErrorText from "@/components/ui/ErrorText";

import { StyledLabel, StyledSelect, Wrapper } from "./styles";

export type Option = {
	label: string;
	value: string | number | null;
};

export interface OptionSelectorProps {
	options: Option[];
	value?: Option["value"];
	defaultValue?: Option["value"];
	onChange?: (value: Option["value"]) => void;
	className?: string;
	disabled?: boolean;
	label: string;
	error?: string;
}

export interface OptionSelectorRef {
	focus: () => void;
	getValue: () => Option["value"] | undefined;
}

const OptionSelector = forwardRef<OptionSelectorRef, OptionSelectorProps>(
	({ options, value, defaultValue, onChange, className, disabled, label, error }, ref) => {
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
					value={currentValue ?? ""}
					onChange={handleChange}
					disabled={disabled}
					$default={currentValue === ""}
				>
					<option className="default" value={""}>
						-- Selecione --
					</option>
					{options.map((opt) => (
						<option key={opt.value} value={opt.value ?? undefined}>
							{opt.label}
						</option>
					))}
				</StyledSelect>
				<ErrorText error={error} />
			</Wrapper>
		);
	},
);

OptionSelector.displayName = "OptionSelector";

export default OptionSelector;
