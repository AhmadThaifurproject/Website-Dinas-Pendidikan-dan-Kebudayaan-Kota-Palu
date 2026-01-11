import React, { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContextAdmin } from "./ThemeContextAdmin";

export default function ThemeToggle() {
  const context = useContext(ThemeContextAdmin);

  // Fallback jika context null
  if (!context) return null; 
  const { theme, toggleTheme } = context;

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-full transition-all duration-300 shadow-sm border ${
        theme === "light"
          ? "bg-white text-indigo-600 border-indigo-100 hover:bg-sky-50"
          : "bg-gray-800 text-yellow-400 border-gray-700 hover:bg-gray-700"
      }`}
      aria-label="Toggle Theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}