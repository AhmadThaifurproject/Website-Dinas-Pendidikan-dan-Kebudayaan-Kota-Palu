import React, { useState } from "react";
import {
  LayoutDashboard, Users, BookOpen, Settings, DollarSign,
  Newspaper, Megaphone, ClipboardList, GraduationCap
} from "lucide-react";

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  theme: "light" | "dark";
}

export default function Sidebar({ activeMenu, setActiveMenu, theme }: SidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string>("");

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? "" : menu);
  };

  const isLight = theme === "light";

  // Class utilitas untuk styling item menu
  const getLinkClass = (isActive: boolean) => `
    flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-200 font-medium text-sm
    ${isActive 
      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
      : isLight 
        ? "text-slate-600 hover:bg-sky-50 hover:text-indigo-600" 
        : "text-gray-400 hover:bg-gray-800 hover:text-sky-400"
    }
  `;

  const getSubMenuClass = (isActive: boolean) => `
    block w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors duration-200 ml-9 border-l-2
    ${isActive
      ? "border-indigo-500 text-indigo-700 bg-indigo-50 font-semibold"
      : isLight
        ? "border-transparent text-slate-500 hover:text-indigo-600 hover:border-indigo-300"
        : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
    }
  `;

  return (
    <aside
      className={`fixed top-0 left-0 w-72 h-screen flex flex-col transition-colors duration-300 border-r z-40 ${
        isLight
          ? "bg-white border-indigo-50"
          : "bg-[#0f0f0f] border-gray-800"
      }`}
    >
      {/* Header Sidebar */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
           <GraduationCap size={24} />
        </div>
        <div>
           <h1 className={`font-extrabold text-xl tracking-tight leading-none ${isLight ? "text-indigo-900" : "text-white"}`}>
            DISDIKBUD
           </h1>
           <span className={`text-[10px] font-semibold tracking-wider ${isLight ? "text-sky-500" : "text-gray-500"}`}>
            KOTA PALU
           </span>
        </div>
      </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 no-scrollbar">
        <p className={`px-4 text-[10px] font-bold uppercase tracking-wider mb-2 ${isLight ? "text-indigo-300" : "text-gray-600"}`}>Main Menu</p>
        
        <button onClick={() => setActiveMenu("dashboard")} className={getLinkClass(activeMenu === "dashboard")}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        {/* Dropdown Pendidikan */}
        <div>
          <button
            onClick={() => toggleDropdown("pendidikan")}
            className={`flex items-center justify-between w-full ${getLinkClass(["paud", "sd", "smp"].includes(activeMenu))}`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={20} />
              <span>Pendidikan</span>
            </div>
            <span className="text-xs opacity-70">{openDropdown === "pendidikan" ? "▲" : "▼"}</span>
          </button>
          {openDropdown === "pendidikan" && (
            <div className="mt-1 space-y-1 pr-2">
              {["paud", "sd", "smp"].map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveMenu(level)}
                  className={getSubMenuClass(activeMenu === level)}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown Layanan */}
        <div>
          <button
            onClick={() => toggleDropdown("layanan")}
            className={`flex items-center justify-between w-full ${getLinkClass(
              ["kepegawaian", "perencanaan", "aset", "berita", "gtk", "kebudayaan", "subsekretariat", "pengaduan"].includes(activeMenu)
            )}`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList size={20} />
              <span>Layanan</span>
            </div>
            <span className="text-xs opacity-70">{openDropdown === "layanan" ? "▲" : "▼"}</span>
          </button>
          
          {openDropdown === "layanan" && (
            <div className="mt-1 space-y-1 pr-2">
              {[
                { key: "kepegawaian", label: "Kepegawaian" },
                { key: "gtk", label: "Ketenagaan GTK" },
                { key: "perencanaan", label: "Perencanaan" },
                { key: "aset", label: "Aset & Keuangan" },
                { key: "kebudayaan", label: "Kebudayaan" },
                { key: "subsekretariat", label: "Sub Sekretariat" },
                { key: "berita", label: "Berita" },
                { key: "pengaduan", label: "Pengaduan" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key)}
                  className={getSubMenuClass(activeMenu === item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`my-4 border-t ${isLight ? 'border-indigo-50' : 'border-gray-800'}`}></div>
        <p className={`px-4 text-[10px] font-bold uppercase tracking-wider mb-2 ${isLight ? "text-indigo-300" : "text-gray-600"}`}>System</p>

        <button onClick={() => setActiveMenu("pengaturan")} className={getLinkClass(activeMenu === "pengaturan")}>
          <Settings size={20} />
          <span>Pengaturan</span>
        </button>
      </div>

      {/* Footer */}
      <div className={`p-4 border-t text-center ${isLight ? "border-indigo-50 bg-indigo-50/30" : "border-gray-800 bg-gray-900"}`}>
        <p className={`text-[10px] ${isLight ? "text-indigo-400" : "text-gray-500"}`}>
          © 2025 Disdikbud Admin
        </p>
      </div>
    </aside>
  );
}