import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  DollarSign,
  Newspaper,
  Megaphone,
  Moon,
  Sun,
  User,
  KeyRound,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { ThemeContextAdmin } from "../../Components/themeContextAdmin";


import Berita from "./Konten/Berita";
import FormInputData from "./Konten_Layanan_SMP/FormInputData";
import FormInputDataPaud from "./Konten_Layanan_PAUD/FormInputDataPaud";
import FormInputDataSD from "./Konten_Layanan_SD/FormInputDataSD";
import FormInputDataKepegawaian from "./Konten_Layanan_Kepegawaian/FormInputDataKepegawaian";
import FormInputDataPerencanaan from "./Konten_Layanan_Perencanaan/FormInputDataPerencanaan";
import FormInputDataAsetDanKeuangan from "./Konten_Layanan_AsetdanKeuangan/FormInputDataAsetDanKeuangan";
import PengaduanMasyarakat from "./Konten_Pengaduan_Masyarakat/PengaduanMasyarakat";
import Pengaturan from "./Konten_Pengaturan/Pengaturan";
import FormInputDataKetenagaan from "./Konten_Layanan_Ketenagaan/FormInputDataKetenagaan";
import FormInputDataKebudayaan from "./Konten_Layanan_Kebudayaan/FormInputDataKebudayaan";
import FormInputDataSubSekretariat from "./Konten_layanan_sub-sekretariat/FormInputDataSubSekretariat";

// --- Types ---
interface Particle {
  top: number;
  left: number;
  size: number;
  delay: number;
}

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => {
    const arr: Particle[] = Array.from({ length: 20 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(arr);
  }, []);

  return (
     <ThemeContextAdmin.Provider value={{ theme, toggleTheme }}>
      <div
        className={`flex min-h-screen transition-colors duration-500 ${
          theme === "light" ? "bg-gray-100" : "bg-[#0f0f0f]"
        }`}
      >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-72 h-screen flex flex-col shadow-2xl overflow-hidden transition-colors duration-500 box-border ${
          theme === "light"
            ? "bg-gradient-to-br from-white/80 to-blue-100/60 border-gray-200 backdrop-blur-xl"
            : "bg-gradient-to-br from-gray-900/70 to-gray-800/60 border-gray-700 backdrop-blur-xl"
        }`}
      >
        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/40 animate-pulse"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Isi Sidebar */}
        <div className="relative z-10 flex-1 flex flex-col overflow-y-auto no-scrollbar px-4 py-6">
          <h2
            className={`text-2xl font-extrabold mb-6 tracking-wide ${
              theme === "light" ? "text-blue-700" : "text-blue-400"
            }`}
          >
            ✨ Nusantara Admin
          </h2>

          {/* Nav */}
          <nav className="space-y-2">
            {/* Dashboard */}
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors duration-200 ${
                activeMenu === "dashboard"
                  ? "bg-blue-500 text-white shadow-lg"
                  : theme === "light"
                  ? "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  : "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
              }`}
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </button>

            {/* Dropdown Pendidikan */}
            <div>
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "pendidikan" ? "" : "pendidikan")
                }
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors duration-200 ${
                  ["paud", "sd", "smp"].includes(activeMenu)
                    ? "bg-blue-500 text-white shadow-lg"
                    : theme === "light"
                    ? "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                    : "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen />
                  <span>Pendidikan</span>
                </div>
                <span>{openDropdown === "pendidikan" ? "▲" : "▼"}</span>
              </button>

              {openDropdown === "pendidikan" && (
                <div className="ml-6 mt-2 space-y-2">
                  {["paud", "sd", "smp"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setActiveMenu(level)}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                        activeMenu === level
                          ? "bg-blue-200 text-blue-800 font-semibold"
                          : theme === "light"
                          ? "text-gray-700 hover:bg-blue-50"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
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
                onClick={() =>
                  setOpenDropdown(openDropdown === "layanan" ? "" : "layanan")
                }
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors duration-200 ${
                  [
                    "kepegawaian",
                    "perencanaan",
                    "aset",
                    "berita",
                    "gtk",
                    "kebudayaan",
                    "subsekretariat",
                    "pengaduan",
                  ].includes(activeMenu)
                    ? "bg-blue-500 text-white shadow-lg"
                    : theme === "light"
                    ? "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                    : "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList />
                  <span>Layanan</span>
                </div>
                <span>{openDropdown === "layanan" ? "▲" : "▼"}</span>
              </button>

              {openDropdown === "layanan" && (
                <div className="ml-6 mt-2 space-y-2">
                  {[
                    { key: "kepegawaian", label: "Kepegawaian", icon: <Users /> },
                    { key: "perencanaan", label: "Perencanaan", icon: <ClipboardList /> },
                    { key: "aset", label: "Aset & Keuangan", icon: <DollarSign /> },
                    { key: "berita", label: "Berita", icon: <Newspaper /> },
                    { key: "gtk", label: "Ketenagaan GTK", icon: <Users /> },
                    { key: "kebudayaan", label: "Kebudayaan", icon: <BookOpen /> },
                    { key: "subsekretariat", label: "Sub Sekretariat", icon: <Settings /> },
                    { key: "pengaduan", label: "Pengaduan Masyarakat", icon: <Megaphone /> },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setActiveMenu(item.key)}
                      className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
                        activeMenu === item.key
                          ? "bg-blue-200 text-blue-800 font-semibold"
                          : theme === "light"
                          ? "text-gray-700 hover:bg-blue-50"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Pengaturan */}
            <button
              onClick={() => setActiveMenu("pengaturan")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors duration-200 ${
                activeMenu === "pengaturan"
                  ? "bg-blue-500 text-white shadow-lg"
                  : theme === "light"
                  ? "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  : "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
              }`}
            >
              <Settings />
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div
          className={`relative z-10 text-xs text-center p-4 border-t ${
            theme === "light"
              ? "text-gray-500 border-gray-200"
              : "text-gray-400 border-gray-700"
          }`}
        >
          <span>© 2025 Nusantara Dashboard</span>
          <br />
          <span className="text-[10px] text-gray-400">Made with ❤️</span>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 ml-72 p-8 overflow-auto">
        {/* Header */}
        <div
          className={`flex justify-end items-center gap-4 mb-6 p-3 rounded-2xl shadow-md transition-colors ${
            theme === "light"
              ? "bg-white border border-gray-200"
              : "bg-gray-800 border border-gray-700"
          }`}
        >
          {/* Dark/Light Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full shadow-md transition ${
              theme === "light"
                ? "bg-white text-blue-600 hover:bg-blue-50"
                : "bg-gray-700 text-yellow-400 hover:bg-gray-600"
            }`}
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`p-3 rounded-full shadow-md transition ${
                theme === "light"
                  ? "bg-white text-gray-700 hover:bg-gray-100"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              <User />
            </button>
            {profileOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg overflow-hidden ${
                  theme === "light" ? "bg-white" : "bg-gray-800"
                }`}
              >
                <button className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100">
                  <User className="w-4 h-4" /> Profil Saya
                </button>
                <button className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100">
                  <KeyRound className="w-4 h-4" /> Ganti Password
                </button>
                <button className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100">
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Konten Utama */}
        <div
          className={`border shadow-lg rounded-2xl p-6 transition-colors ${
            theme === "light"
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-gray-900 border-gray-700 text-gray-100"
          }`}
        >
          {activeMenu === "dashboard" && (
            <div className="text-lg font-semibold">
              Selamat datang di Dashboard Nusantara 🌿
            </div>
          )}
          {activeMenu === "paud" && <FormInputDataPaud selectedCategory="PAUD" />}
          {activeMenu === "sd" && <FormInputDataSD selectedCategory="SD" />}
          {activeMenu === "smp" && <FormInputData selectedCategory="SMP" />}
          {activeMenu === "kepegawaian" && (
            <FormInputDataKepegawaian selectedCategory="KEPEGAWAIAN" />
          )}
          {activeMenu === "perencanaan" && (
            <FormInputDataPerencanaan selectedCategory="PERENCANAAN" />
          )}
          {activeMenu === "aset" && (
            <FormInputDataAsetDanKeuangan selectedCategory="ASET & KEUANGAN" />
          )}
          {activeMenu === "berita" && <Berita />}
          {activeMenu === "pengaduan" && <PengaduanMasyarakat />}
          {activeMenu === "pengaturan" && <Pengaturan />}
          {/* Placeholder untuk menu tambahan */}
         {activeMenu === "gtk" && (
            <FormInputDataKetenagaan selectedCategory="KETENAGAAN GTK" />
          )}
          {activeMenu === "kebudayaan" && (
            <FormInputDataKebudayaan selectedCategory="KEBUDAYAAN" />
          )}
          {activeMenu === "subsekretariat" && (
            <FormInputDataSubSekretariat selectedCategory="SUB SEKRETARIAT" />
          )}

        </div>
      </main>
    </div>
    </ThemeContextAdmin.Provider>
  );
}
