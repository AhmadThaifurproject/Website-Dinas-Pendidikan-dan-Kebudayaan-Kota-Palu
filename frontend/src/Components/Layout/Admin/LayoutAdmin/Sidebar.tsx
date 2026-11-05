import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, BookOpen, Settings,
  Newspaper, ClipboardList, GraduationCap, ShieldAlert,
  Activity
} from "lucide-react";

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  theme: "light" | "dark";
  userRole: string; 
}

export default function Sidebar({ activeMenu, setActiveMenu, theme, userRole }: SidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string>("");

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? "" : menu);
  };

  const isLight = theme === "light";

  // Identifikasi Role
  const isTeknisi = userRole === 'teknisi' || userRole === 'super_admin';
  const isAdminBiasa = userRole === 'admin';

  // --- AUTO REDIRECT DEFAULT MENU ---
  useEffect(() => {
    if (isTeknisi && activeMenu === 'dashboard') {
        setActiveMenu('panel-kontrol-layanan');
    }
  }, [isTeknisi, activeMenu, setActiveMenu]);

  // Class utilitas untuk styling item menu
  const getLinkClass = (isActive: boolean) => `
    flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl w-full text-left transition-all duration-200 font-medium text-xs lg:text-sm
    ${isActive 
      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
      : isLight 
        ? "text-slate-600 hover:bg-sky-50 hover:text-indigo-600" 
        : "text-gray-400 hover:bg-gray-800 hover:text-sky-400"
    }
  `;

  const getSuperAdminLinkClass = (isActive: boolean) => `
    flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl w-full text-left transition-all duration-200 font-bold text-xs lg:text-sm
    ${isActive 
      ? "bg-rose-600 text-white shadow-md shadow-rose-200" 
      : isLight 
        ? "text-rose-600 bg-rose-50 hover:bg-rose-100" 
        : "text-rose-400 bg-rose-900/20 hover:bg-rose-900/40"
    }
  `;

  const getSubMenuClass = (isActive: boolean) => `
    block w-full text-left px-4 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm transition-colors duration-200 ml-8 lg:ml-9 border-l-2
    ${isActive
      ? "border-indigo-500 text-indigo-700 bg-indigo-50 font-semibold"
      : isLight
        ? "border-transparent text-slate-500 hover:text-indigo-600 hover:border-indigo-300"
        : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
    }
  `;

  return (
    <aside
      // ⚠️ FIX: Menghapus 'fixed h-screen' dan menggantinya dengan 'h-full'. 
      // Lebar dipisah spesifik antara mobile (w-[260px]) dan desktop (w-72)
      className={`flex flex-col h-full w-[260px] lg:w-72 transition-colors duration-300 border-r z-40 ${
        isLight
          ? "bg-white border-indigo-50"
          : "bg-[#0f0f0f] border-gray-800"
      }`}
    >
      {/* Header Sidebar */}
      <div className="p-5 lg:p-6 flex items-center gap-3">
        <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-white shadow-lg ${isTeknisi ? 'bg-rose-600 shadow-rose-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
           {isTeknisi ? <ShieldAlert className="w-5 h-5 lg:w-6 lg:h-6" /> : <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6" />}
        </div>
        <div>
           <h1 className={`font-extrabold text-lg lg:text-xl tracking-tight leading-none ${isLight ? "text-indigo-900" : "text-white"}`}>
            DISDIKBUD
           </h1>
           <span className={`text-[9px] lg:text-[10px] font-semibold tracking-wider ${isLight ? (isTeknisi ? "text-rose-500" : "text-sky-500") : "text-gray-500"}`}>
            KOTA PALU
           </span>
        </div>
      </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto px-3 lg:px-4 py-2 space-y-1 no-scrollbar animate-fade-in">
        
        {/* ========================================== */}
        {/* BLOK MENU KHUSUS ADMIN BIASA               */}
        {/* ========================================== */}
        {isAdminBiasa && (
          <div className="space-y-1">
            <p className={`px-4 text-[9px] lg:text-[10px] font-bold uppercase tracking-wider mb-2 ${isLight ? "text-indigo-300" : "text-gray-600"}`}>Main Menu Admin</p>
            
            <button onClick={() => setActiveMenu("dashboard")} className={getLinkClass(activeMenu === "dashboard")}>
              <LayoutDashboard size={18} className="lg:w-5 lg:h-5" />
              <span>Dashboard</span>
            </button>

            <button onClick={() => setActiveMenu("berita")} className={getLinkClass(activeMenu === "berita")}>
              <Newspaper size={18} className="lg:w-5 lg:h-5" />
              <span>Berita Instansi</span>
            </button>

            {/* Dropdown Pendidikan */}
            <div>
              <button onClick={() => toggleDropdown("pendidikan")} className={`flex items-center justify-between w-full ${getLinkClass(["paud", "sd", "smp"].includes(activeMenu))}`}>
                <div className="flex items-center gap-3"><BookOpen size={18} className="lg:w-5 lg:h-5" /><span>Pendidikan</span></div>
                <span className="text-xs opacity-70">{openDropdown === "pendidikan" ? "▲" : "▼"}</span>
              </button>
              {openDropdown === "pendidikan" && (
                <div className="mt-1 space-y-1 pr-2">
                  {["paud", "sd", "smp"].map((level) => (
                    <button key={level} onClick={() => setActiveMenu(level)} className={getSubMenuClass(activeMenu === level)}>{level.toUpperCase()}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown Layanan Publik */}
            <div>
              <button onClick={() => toggleDropdown("layanan")} className={`flex items-center justify-between w-full ${getLinkClass(["kepegawaian", "perencanaan", "aset", "gtk", "kebudayaan", "subsekretariat"].includes(activeMenu))}`}>
                <div className="flex items-center gap-3"><ClipboardList size={18} className="lg:w-5 lg:h-5" /><span>Layanan Publik</span></div>
                <span className="text-xs opacity-70">{openDropdown === "layanan" ? "▲" : "▼"}</span>
              </button>
              
              {openDropdown === "layanan" && (
                <div className="mt-1 space-y-1 pr-2">
                  {[
                    { key: "kepegawaian", label: "Kepegawaian" }, { key: "gtk", label: "Ketenagaan GTK" },
                    { key: "perencanaan", label: "Perencanaan" }, { key: "aset", label: "Aset & Keuangan" },
                    { key: "kebudayaan", label: "Kebudayaan" }, { key: "subsekretariat", label: "Sub Sekretariat" },
                  ].map((item) => (
                    <button key={item.key} onClick={() => setActiveMenu(item.key)} className={getSubMenuClass(activeMenu === item.key)}>{item.label}</button>
                  ))}
                </div>
              )}
            </div>
            
            <div className={`my-4 border-t ${isLight ? 'border-indigo-50' : 'border-gray-800'}`}></div>
            <p className={`px-4 text-[9px] lg:text-[10px] font-bold uppercase tracking-wider mb-2 ${isLight ? "text-indigo-300" : "text-gray-600"}`}>Sistem Utama</p>
            
            <button onClick={() => setActiveMenu("pengaturan")} className={getLinkClass(activeMenu === "pengaturan")}>
              <Settings size={18} className="lg:w-5 lg:h-5" />
              <span>Pusat Kontrol</span>
            </button>
            
          </div>
        )}

        {/* ========================================== */}
        {/* BLOK MENU KHUSUS TEKNISI (SUPER ADMIN)     */}
        {/* ========================================== */}
        {isTeknisi && (
           <div className="space-y-2">
              <p className={`px-4 text-[9px] lg:text-[10px] font-black uppercase tracking-widest mb-3 ${isLight ? "text-rose-400" : "text-rose-600"}`}>Akses Inti Teknisi</p>
              
              <button 
                onClick={() => setActiveMenu("panel-kontrol-layanan")} 
                className={getSuperAdminLinkClass(activeMenu === "panel-kontrol-layanan")}
              >
                <ShieldAlert size={18} className="lg:w-5 lg:h-5" />
                <span>Panel Kontrol Layanan</span>
              </button>

              <button 
                onClick={() => setActiveMenu("tracking-activity")} 
                className={getSuperAdminLinkClass(activeMenu === "tracking-activity")}
              >
                <Activity size={18} className="lg:w-5 lg:h-5" />
                <span>Tracking Activity</span>
              </button>
           </div>
        )}

      </div>

      {/* Footer */}
      <div className={`p-3 lg:p-4 border-t text-center flex flex-col items-center justify-center ${isLight ? (isTeknisi ? "border-rose-100 bg-rose-50/50" : "border-indigo-50 bg-indigo-50/30") : "border-gray-800 bg-gray-900"}`}>
        <p className={`text-[9px] lg:text-[10px] font-bold uppercase tracking-widest ${isLight ? (isTeknisi ? "text-rose-600" : "text-indigo-600") : "text-gray-400"}`}>
          Role: {userRole.replace('_', ' ')}
        </p>
        <span className={`text-[7px] lg:text-[8px] mt-1 ${isLight ? "text-slate-400" : "text-slate-600"}`}>© 2026 Disdikbud Kota Palu</span>
      </div>
    </aside>
  );
}