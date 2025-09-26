export type ThemeType = {
	name: string;
	primary: string;
	primaryText: string;
	primaryHighlight: string;
	secondary: string;
	background: string;
	background2: string;
	text: string;
	white: string;
	gray: string;
	black: string;
};

export const LightTheme: ThemeType = {
	name: "light",
	primary: "#C2393E",
	primaryHighlight: "#CC4549",
	primaryText: "#EAEAEA",
	secondary: "#EEEEEE",
	background: "#FAFAFA",
	background2: "#DDDDDD",
	text: "#333333",
	white: "#EAEAEA",
	gray: "#727376",
	black: "#373435",
};

export const DarkTheme: ThemeType = {
	name: "dark",
	primary: "#C2393E",
	primaryHighlight: "#CC4549",
	primaryText: "#FFFFFF",
	secondary: "#727376",
	background: "#373435",
	background2: "#505050",
	text: "#FFFFFF",
	white: "#DDDDDD",
	gray: "#727376",
	black: "#373435",
};
