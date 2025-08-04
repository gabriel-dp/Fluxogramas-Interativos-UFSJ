import { forwardRef } from "react";

import { Label, HiddenCheckbox, StyledCheckbox, LabelText } from "./styles";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
	label: string;
	checked?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, checked = false, ...rest }, ref) => (
	<Label>
		<HiddenCheckbox ref={ref} checked={checked} {...rest} />
		<StyledCheckbox checked={checked} />
		{label && <LabelText>{label}</LabelText>}
	</Label>
));

Checkbox.displayName = "Checkbox";

export default Checkbox;
