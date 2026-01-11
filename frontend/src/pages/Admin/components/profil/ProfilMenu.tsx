import React, { useState, useContext } from "react";
import { User, KeyRound, LogOut, ChevronDown } from "lucide-react";
import { ThemeContextAdmin } from "../../../Admin/components/theme/ThemeContextAdmin";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const context = useContext(ThemeContextAdmin);
  const theme = context?.theme || "light";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-300 ${
          theme === "light"
            ? "bg-white border-indigo-100 hover:bg-sky-50"
            : "bg-gray-800 border-gray-700 hover:bg-gray-700"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md">
          <User size={16} />
        </div>
        <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Admin</span>
        <ChevronDown size={14} className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div
            className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl z-20 border overflow-hidden transform transition-all ${
              theme === "light"
                ? "bg-white border-indigo-100"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className={`px-4 py-3 border-b ${theme === 'light' ? 'bg-indigo-50/50 border-indigo-100' : 'bg-gray-700/50 border-gray-600'}`}>
              <p className={`text-sm font-bold ${theme === 'light' ? 'text-indigo-900' : 'text-white'}`}>Administrator</p>
              <p className="text-xs text-gray-500">admin@disdikbud.palu</p>
            </div>
            <div className="p-1">
              <MenuItem icon={<User size={16} />} label="Profil Saya" theme={theme} />
              <MenuItem icon={<KeyRound size={16} />} label="Ganti Password" theme={theme} />
              <div className={`my-1 border-t ${theme === 'light' ? 'border-gray-100' : 'border-gray-700'}`}></div>
              <MenuItem icon={<LogOut size={16} />} label="Keluar" theme={theme} isDanger />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Sub-component kecil untuk item menu agar rapi
const MenuItem = ({ icon, label, theme, isDanger = false }: any) => (
  <button
    className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors ${
      isDanger 
        ? "text-red-500 hover:bg-red-50" 
        : theme === "light"
          ? "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`}
  >
    {icon}
    {label}
  </button>
);