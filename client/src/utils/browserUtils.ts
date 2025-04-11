// Check if browser default theme is dark
export const darkThemePreferred = (): boolean => window.matchMedia("(prefers-color-scheme: dark)").matches;

// Get browser default language
// export const getPreferredLanguage = (): string => navigator.language;
