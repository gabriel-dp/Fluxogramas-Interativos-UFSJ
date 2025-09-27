import "styled-components";

type HexColor = `#${string}`;

declare module "styled-components" {
	export interface DefaultTheme {
		name: string;
		primary: HexColor;
		primaryText: HexColor;
		primaryHighlight: HexColor;
		secondary: HexColor;
		background: HexColor;
		background2: HexColor;
		text: HexColor;
		white: HexColor;
		gray: HexColor;
		black: HexColor;
	}
}
