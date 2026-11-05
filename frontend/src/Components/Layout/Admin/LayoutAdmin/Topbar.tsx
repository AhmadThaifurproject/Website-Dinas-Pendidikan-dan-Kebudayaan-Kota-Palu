import React, { useContext } from "react";
import { Search } from "lucide-react"; 
import ThemeToggle from "../../../../pages/Admin/Components/theme/ThemeToggle.tsx";
import ProfileMenu from "../../../../pages/Admin/Components/profil/ProfilMenu.tsx";
import { ThemeContextAdmin } from "../../../../pages/Admin/Components/theme/ThemeContextAdmin.tsx";
import Notification from "../../../../feature/notif/notification.tsx";

interface TopbarProps {
  setActiveMenu?: (menu: string) => void;
  onLogoutRequest: () => void;
}

export default function Topbar({ setActiveMenu, onLogoutRequest }: TopbarProps) {
  const context = useContext(ThemeContextAdmin);
  const theme = context?.theme || "light";

  const rawRole = sessionStorage.getItem('userRole') || 'admin';
  const userRole = rawRole.toLowerCase().trim();

  return (
    <header
      // ⚠️ FIX: Layout dipisah antara p-4 (mobile) dan px-8 py-4 (desktop). 
      // Radius juga dikurangi di mobile menjadi rounded-xl agar tidak memotong ruang konten.
      className={`sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4 mb-4 lg:mb-6 rounded-xl lg:rounded-2xl transition-all duration-300 backdrop-blur-md shadow-sm border ${
        theme === "light"
          ? "bg-white/80 border-white shadow-indigo-100/50"
          : "bg-gray-900/80 border-gray-800 shadow-black/20"
      }`}
    >
      {/* --- Bagian Kiri: Judul & Salam --- */}
      {/* Teks salam akan disembunyikan (hidden) pada layar sangat kecil agar tidak tertabrak menu profil */}
      <div className="hidden sm:block">
        <h2 className={`text-base lg:text-lg font-bold tracking-tight ${theme === 'light' ? 'text-indigo-900' : 'text-white'}`}>
          Panel Kontrol
        </h2>
        <p className={`text-[10px] lg:text-xs ${theme === 'light' ? 'text-indigo-400' : 'text-gray-500'}`}>
          Selamat bekerja, {userRole === 'teknisi' || userRole === 'super_admin' ? 'Teknisi' : 'Admin'}!
        </p>
      </div>

      {/* Jika ingin memberikan spacer khusus untuk layar HP ketika teks kiri di-hidden */}
      <div className="block sm:hidden flex-1"></div>

      {/* --- Bagian Kanan: Search, Notif, Theme, Profile --- */}
      <div className="flex items-center gap-2 lg:gap-4 w-full sm:w-auto justify-end">
        
        {/* 1. Fitur Search */}
        {/* Tetap disembunyikan di mobile, namun ukurannya sedikit disesuaikan di layar sedang (md) */}
        <div className={`hidden md:flex items-center px-3 py-1.5 rounded-full border transition-colors ${
            theme === 'light' 
            ? 'bg-white/50 border-indigo-100 text-gray-600' 
            : 'bg-gray-800/50 border-gray-700 text-gray-300'
        }`}>
          <Search size={16} className={theme === 'light' ? "text-indigo-300" : "text-gray-500"} />
          <input 
            type="text" 
            placeholder="Cari..." 
            className="ml-2 bg-transparent outline-none text-xs w-20 lg:w-24 focus:w-32 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* 2. Fitur Notifikasi */}
        <Notification theme={theme} userRole={userRole} />

        {/* Separator */}
        <div className={`h-5 lg:h-6 w-px ${theme === 'light' ? 'bg-indigo-100' : 'bg-gray-700'}`}></div>
        
        {/* 3. Theme Toggle */}
        <ThemeToggle />
        
        {/* 4. Profile Menu */}
        <ProfileMenu 
            setActiveMenu={setActiveMenu} 
            onLogoutRequest={onLogoutRequest} 
        />
        
      </div>
    </header>
  );
}