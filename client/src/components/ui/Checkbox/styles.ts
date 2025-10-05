import styled from "styled-components";

export const Label = styled.label`
	display: flex;
	align-items: center;
	cursor: pointer;
	margin: 0.5rem 0;
`;

export const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
	display: none;
`;

export const StyledCheckbox = styled.div<{ checked: boolean }>`
	min-width: 1.25rem;
	min-height: 1.25rem;
	background: ${(props) => (props.checked ? props.theme.primary : props.theme.primaryText)};
	border-radius: 0.25rem;
	transition: all 0.2s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
	font-weight: bold;
	color: ${(props) => props.theme.primaryText};
	border: 1px solid ${(props) => props.theme.text}44;

	&::after {
		content: ${({ checked }) => (checked ? '"✓"' : '""')};
		display: block;
	}
`;

export const LabelText = styled.span`
	margin-left: 0.5rem;
	font-size: 1rem;
	user-select: none;
`;

export const CheckboxList = styled.div<{ $direction?: string }>`
	display: flex;
	flex-direction: ${(props) => (props.$direction == "row" ? "row" : "column")};
	gap: 0 !important;
`;
