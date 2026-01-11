import React, { useState } from "react";
import { ThemeContextAdmin } from "../components/theme/ThemeContextAdmin";

// Import Layout Components
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

// Import Content Components
import Berita from "../Konten/berita/Berita";
import FormInputData from "../Konten/layanan/smp/FormInputDataSmp";
import FormInputDataPaud from "../Konten/layanan/paud/FormInputDataPaud";
import FormInputDataSD from "../Konten/layanan/sd/FormInputDataSD";
import FormInputDataKepegawaian from "../Konten/layanan/kepeegawaian/FormInputDataKepegawaian";
import FormInputDataPerencanaan from "../Konten/layanan/perencanaan/FormInputDataPerencanaan";
import FormInputDataAsetDanKeuangan from "../Konten/layanan/aset-keuangan/FormInputDataAsetDanKeuangan";
import PengaduanMasyarakat from "../Konten/layanan/pengaduan-masyarakat/PengaduanMasyarakat";
import Pengaturan from "../pengaturan/Pengaturan";
import FormInputDataKetenagaan from "../Konten/layanan/ketenagaan/FormInputDataKetenagaan";
import FormInputDataKebudayaan from "../Konten/layanan/kebudayaan/FormInputDataKebudayaan";
import FormInputDataSubSekretariat from "../Konten/layanan/sub-sekretariat/FormInputDataSubSekretariat";

// [BARU] Import Agenda Control
// Pastikan nama file sesuai (AgendaControl atau AgendaControll)
import AgendaControl from "../Konten/Poster/AgendaControll"; 

export default function DashboardAdmin() {
  const [activeMenu, setActiveMenu] = useState<string>("dashboard");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  return (
    <ThemeContextAdmin.Provider value={{ theme, toggleTheme }}>
      <div
        className={`flex min-h-screen transition-colors duration-500 ${
          theme === "light" ? "bg-slate-50" : "bg-[#0a0a0a]"
        }`}
      >
        {/* Sidebar Component */}
        <Sidebar 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu} 
          theme={theme} 
        />

        {/* Main Content Area */}
        <main className="flex-1 ml-72 p-8 h-screen overflow-y-auto">
          
          {/* Topbar Component (Contains Profile & Theme Toggle) */}
          <Topbar />

          {/* Dynamic Content Container */}
          <div className="animate-fade-in-up">
            {activeMenu === "dashboard" && (
              <div className={`p-8 rounded-3xl text-center border-2 border-dashed ${theme === 'light' ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-700 bg-gray-800/50'}`}>
                <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-indigo-900' : 'text-white'}`}>
                  Selamat datang di Dashboard Admin Disdikbud 🌿
                </h2>
                <p className={`${theme === 'light' ? 'text-indigo-500' : 'text-gray-400'}`}>
                  Pilih menu di sebelah kiri untuk mengelola data.
                </p>
              </div>
            )}

            {/* Render Konten Berdasarkan Menu */}
            <div className={`transition-all duration-300 ${activeMenu !== 'dashboard' ? 'block' : 'hidden'}`}>
                {activeMenu === "paud" && <FormInputDataPaud selectedCategory="PAUD" />}
                {activeMenu === "sd" && <FormInputDataSD selectedCategory="SD" />}
                {activeMenu === "smp" && <FormInputData selectedCategory="SMP" />}
                {activeMenu === "kepegawaian" && <FormInputDataKepegawaian selectedCategory="KEPEGAWAIAN" />}
                {activeMenu === "perencanaan" && <FormInputDataPerencanaan selectedCategory="PERENCANAAN" />}
                {activeMenu === "aset" && <FormInputDataAsetDanKeuangan selectedCategory="ASET & KEUANGAN" />}
                {activeMenu === "berita" && <Berita />}
                {activeMenu === "gtk" && <FormInputDataKetenagaan selectedCategory="KETENAGAAN GTK" />}
                {activeMenu === "kebudayaan" && <FormInputDataKebudayaan selectedCategory="KEBUDAYAAN" />}
                {activeMenu === "subsekretariat" && <FormInputDataSubSekretariat selectedCategory="SUB SEKRETARIAT" />}
                {activeMenu === "pengaduan" && <PengaduanMasyarakat />}
                {activeMenu === "pengaturan" && <Pengaturan setActiveMenu={setActiveMenu} />}
                {activeMenu === "agenda" && <AgendaControl />}
            </div>
          </div>
        </main>
      </div>
    </ThemeContextAdmin.Provider>
  );
}