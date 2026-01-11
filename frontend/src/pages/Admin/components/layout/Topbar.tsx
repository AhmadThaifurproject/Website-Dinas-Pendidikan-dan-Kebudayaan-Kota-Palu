import React, { useContext } from "react";
import ThemeToggle from "../theme/ThemeToggle";
import ProfileMenu from "../../components/profil/ProfilMenu";
import { ThemeContextAdmin } from "../theme/ThemeContextAdmin";

export default function Topbar() {
  const context = useContext(ThemeContextAdmin);
  const theme = context?.theme || "light";

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-8 py-4 mb-6 rounded-2xl transition-all duration-300 backdrop-blur-md shadow-sm border ${
        theme === "light"
          ? "bg-white/80 border-white shadow-indigo-100/50"
          : "bg-gray-900/80 border-gray-800 shadow-black/20"
      }`}
    >
      <div>
        {/* Breadcrumb sederhana atau Judul Halaman bisa ditaruh di sini */}
        <h2 className={`text-lg font-bold tracking-tight ${theme === 'light' ? 'text-indigo-900' : 'text-white'}`}>
          Panel Kontrol
        </h2>
        <p className={`text-xs ${theme === 'light' ? 'text-indigo-400' : 'text-gray-500'}`}>
          Selamat bekerja, Admin!
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className={`h-6 w-px ${theme === 'light' ? 'bg-indigo-100' : 'bg-gray-700'}`}></div>
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </header>
  );
}