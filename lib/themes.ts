export type ThemeName = "light" | "dark" | "blue" | "green" | "purple" | "red" | "orange" | "pink" | "yellow" | "teal"

export const themeNames: Record<ThemeName, string> = {
  light: "Light",
  dark: "Dark",
  blue: "Blue",
  green: "Green",
  purple: "Purple",
  red: "Red",
  orange: "Orange",
  pink: "Pink",
  yellow: "Yellow",
  teal: "Teal",
}

export const defaultTheme: ThemeName = "light"
