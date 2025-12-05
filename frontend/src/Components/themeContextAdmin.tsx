// src/context/themeContextAdmin.tsx
import React, { createContext, useContext } from "react";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContextAdmin = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
});

export const useThemeAdmin = () => useContext(ThemeContextAdmin);
