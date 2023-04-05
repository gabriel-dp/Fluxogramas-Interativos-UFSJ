export type ThemeType = {
	primary: string;
	primaryText: string;
	secondary: string;
	background: string;
	background2: string;
	text: string;
	white: string;
	gray: string;
	black: string;
};

export const LightTheme: ThemeType = {
	primary: "#C2393E",
	primaryText: "#FFFFFF",
	secondary: "#FEFEFE",
	background: "#CCCCCC",
	background2: "#373435",
	text: "#333333",
	white: "#FFFFFF",
	gray: "#727376",
	black: "#373435",
};

export const DarkTheme: ThemeType = {
	primary: "#C2393E",
	primaryText: "#FFFFFF",
	secondary: "#727376",
	background: "#373435",
	background2: "#727376",
	text: "#FFFFFF",
	white: "#FFFFFF",
	gray: "#727376",
	black: "#373435",
};
