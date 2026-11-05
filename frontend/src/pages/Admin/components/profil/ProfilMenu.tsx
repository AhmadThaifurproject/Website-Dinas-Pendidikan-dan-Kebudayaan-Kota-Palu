import React, { useState, useContext, useEffect } from "react";
import { User, KeyRound, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import { ThemeContextAdmin } from "../theme/ThemeContextAdmin.tsx";

interface ProfileMenuProps {
  setActiveMenu?: (menu: string) => void;
  onLogoutRequest: () => void; 
}

export default function ProfileMenu({ setActiveMenu, onLogoutRequest }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(ThemeContextAdmin);
  const theme = context?.theme || "light";

  // --- STATE UNTUK DATA USER DINAMIS ---
  const [userData, setUserData] = useState({
    name: "Memuat...", // Beri indikasi awal bahwa data sedang dimuat
    email: "...",
    role: "admin"
  });

  // --- FIX: MENGAMBIL DATA DARI SESSION STORAGE SAAT KOMPONEN DIMUAT ---
  useEffect(() => {
    try {
      // WAJIB menggunakan sessionStorage agar sesuai dengan sistem login baru
      const storedUser = sessionStorage.getItem('userData');
      const storedRole = sessionStorage.getItem('userRole');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          name: parsedUser.name || "Admin Disdikbud",
          email: parsedUser.email || "admin@disdikbud.palu",
          role: storedRole || parsedUser.role || "admin"
        });
      }
    } catch (error) {
      console.error("Gagal membaca data user:", error);
      // Fallback fallback jika parse error
      setUserData({
          name: "Admin System",
          email: "system@disdikbud.palu",
          role: "admin"
      });
    }
  }, []); // Hanya dijalankan sekali saat komponen di-mount

  const handleMenuClick = (menuName: string) => {
    if (setActiveMenu) {
      setActiveMenu(menuName);
    }
    setIsOpen(false);
  };

  // Helper untuk menentukan label dan warna berdasarkan role
  // Kita pastikan kebal terhadap huruf besar/kecil dengan toLowerCase()
  const currentRole = userData.role.toLowerCase().trim();
  const isSuperAdmin = currentRole === 'teknisi' || currentRole === 'super_admin';
  const roleLabel = isSuperAdmin ? "Super Administrator" : "Administrator";
  const avatarGradient = isSuperAdmin 
    ? "from-rose-500 to-orange-400" // Warna khusus Super Admin
    : "from-indigo-500 to-sky-400"; // Warna Admin Biasa

  return (
    <div className="relative">
      {/* Tombol Trigger (Avatar) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-300 ${
          theme === "light"
            ? "bg-white border-indigo-100 hover:bg-sky-50"
            : "bg-gray-800 border-gray-700 hover:bg-gray-700"
        }`}
      >
        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${avatarGradient} flex items-center justify-center text-white shadow-md relative overflow-hidden`}>
          {isSuperAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
        </div>
        <div className="hidden md:block text-left max-w-[120px]">
          <p className={`text-xs font-bold truncate ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
            {userData.name}
          </p>
          <p className={`text-[10px] truncate ${isSuperAdmin ? 'text-rose-500 font-bold' : 'text-gray-500'}`}>
            {roleLabel}
          </p>
        </div>
        <ChevronDown size={14} className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div
            className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl z-20 border overflow-hidden transform transition-all animate-fade-in-up ${
              theme === "light"
                ? "bg-white border-indigo-100"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className={`px-4 py-4 border-b relative overflow-hidden ${theme === 'light' ? 'bg-indigo-50/50 border-indigo-100' : 'bg-gray-700/50 border-gray-600'}`}>
              {/* Ornamen latar belakang untuk Super Admin */}
              {isSuperAdmin && (
                <div className="absolute top-0 right-0 p-2 opacity-10">
                   <ShieldCheck size={64} />
                </div>
              )}
              
              <div className="relative z-10">
                <p className={`text-sm font-extrabold truncate ${theme === 'light' ? 'text-indigo-900' : 'text-white'}`}>
                  {userData.name}
                </p>
                <p className={`text-xs mt-0.5 truncate ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {userData.email}
                </p>
                <div className="mt-2 inline-block">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                    isSuperAdmin 
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800' 
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2">
              <MenuItem 
                icon={<User size={16} />} 
                label="Profil Saya" 
                theme={theme} 
                onClick={() => handleMenuClick("profile")} 
              />
              <MenuItem 
                icon={<KeyRound size={16} />} 
                label="Ganti Password" 
                theme={theme} 
                onClick={() => handleMenuClick("password")} 
              />
              
              <div className={`my-1 border-t ${theme === 'light' ? 'border-gray-100' : 'border-gray-700'}`}></div>
              
              <MenuItem 
                icon={<LogOut size={16} />} 
                label="Keluar dari Sistem" 
                theme={theme} 
                isDanger 
                onClick={() => {
                  setIsOpen(false);
                  onLogoutRequest(); 
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Sub-component MenuItem
const MenuItem = ({ icon, label, theme, isDanger = false, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-left ${
      isDanger 
        ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
        : theme === "light"
          ? "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`}
  >
    {icon}
    {label}
  </button>
);