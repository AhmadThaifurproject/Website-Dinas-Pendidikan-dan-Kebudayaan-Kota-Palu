import { createContext } from 'react';

// Mendefinisikan tipe data untuk Context
export interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// Membuat Context dengan nilai awal undefined
export const ThemeContextAdmin = createContext<ThemeContextType | undefined>(undefined);