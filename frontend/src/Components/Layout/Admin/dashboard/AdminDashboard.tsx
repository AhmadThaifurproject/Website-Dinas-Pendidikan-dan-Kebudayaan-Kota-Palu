import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ThemeContextAdmin } from "../../../../pages/Admin/components/theme/ThemeContextAdmin";
import { useNavigate } from "react-router-dom"; 
import { AlertTriangle, Lock, Menu } from "lucide-react";

// Import Layout Components
import Sidebar from "../LayoutAdmin/Sidebar";
import Topbar from "../LayoutAdmin/Topbar";

// Import Content Components
import Berita from "../../../../pages/Admin/Konten/berita/Berita";
import FormInputData from "../../../../pages/Admin/Konten/layanan/smp/FormInputDataSmp";
import FormInputDataPaud from "../../../../pages/Admin/Konten/layanan/paud/FormInputDataPaud";
import FormInputDataSD from "../../../../pages/Admin/Konten/layanan/sd/FormInputDataSD";
import FormInputDataKepegawaian from "../../../../pages/Admin/Konten/layanan/kepeegawaian/FormInputDataKepegawaian";
import FormInputDataPerencanaan from "../../../../pages/Admin/Konten/layanan/perencanaan/FormInputDataPerencanaan";
import FormInputDataAsetDanKeuangan from "../../../../pages/Admin/Konten/layanan/aset-keuangan/FormInputDataAsetDanKeuangan";
import Pengaturan from "../../../../pages/Admin/pengaturan/Pengaturan";
import FormInputDataKetenagaan from "../../../../pages/Admin/Konten/layanan/ketenagaan/FormInputDataKetenagaan";
import FormInputDataKebudayaan from "../../../../pages/Admin/Konten/layanan/kebudayaan/FormInputDataKebudayaan";
import FormInputDataSubSekretariat from "../../../../pages/Admin/Konten/layanan/sub-sekretariat/FormInputDataSubSekretariat";
import AgendaControl from "../../../../pages/Admin/Konten/Poster/AgendaControll"; 
import KontrolPanelKalender from "../../../../pages/Admin/Konten/Kalender/KontrolPanelKalender";
import ControllPageProfile from "../../../../pages/Admin/Konten/Profil Pejabat/ControllPageProfile";
import ProfilAvatar from "../../../../pages/Admin/components/profil/components/ProfilAvatar"; 
import ChangePassword from "../../../../pages/Admin/components/profil/components/ChangePassword";

// --- IMPORT KHUSUS SUPER ADMIN ---
import PanelKontrolLayanan from "../../../../pages/SuperAdmin/Panel_Kontrol/PanelKontrolLayanan";
import TrackingActivity from "../../../../pages/SuperAdmin/Panel_Kontrol/TrackingActivity"; 

// ✅ FIX: Import Komponen Floating Chat untuk Admin
import ChatHelp from "../../../../pages/Admin/components/feature/bubblechat/ChatHelp";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // State baru untuk kontrol Sidebar di mode Mobile
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // ==========================================
  // 1. IDENTIFIKASI ROLE (SESSION STORAGE)
  // ==========================================
  const rawRole = sessionStorage.getItem('userRole') || 'admin';
  const userRole = rawRole.toLowerCase().trim();
  const isSuperAdmin = userRole === 'teknisi' || userRole === 'super_admin';

  const superAdminAllowedMenus = ['panel-kontrol-layanan', 'tracking-activity', 'profile', 'password', 'pengaturan'];
  const memoryKey = isSuperAdmin ? 'activeTeknisiMenu' : 'activeAdminMenu';

  // ==========================================
  // 2. CEGAH TOMBOL BACK BROWSER (UNDO)
  // ==========================================
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setShowLogoutConfirm(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ==========================================
  // 3. INITIALIZATION GUARD
  // ==========================================
  const [activeMenu, setActiveMenu] = useState<string>(() => {
    const savedMenu = sessionStorage.getItem(memoryKey); 
    
    if (isSuperAdmin) {
      if (savedMenu && superAdminAllowedMenus.includes(savedMenu)) return savedMenu;
      return "panel-kontrol-layanan"; 
    } else {
      if (savedMenu === "panel-kontrol-layanan" || savedMenu === "tracking-activity") return "dashboard";
      return savedMenu || "dashboard"; 
    }
  });

  // ==========================================
  // 4. RUNTIME GUARD & PENYIMPANAN STATE
  // ==========================================
  useEffect(() => {
    if (isSuperAdmin && !superAdminAllowedMenus.includes(activeMenu)) {
        setActiveMenu('panel-kontrol-layanan');
        return;
    } 
    if (!isSuperAdmin && (activeMenu === 'panel-kontrol-layanan' || activeMenu === 'tracking-activity')) {
        setActiveMenu('dashboard');
        return;
    }
    sessionStorage.setItem(memoryKey, activeMenu); 
    
    // Auto-close sidebar di mobile saat menu berubah
    setIsMobileSidebarOpen(false);
  }, [activeMenu, isSuperAdmin, memoryKey]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  const handleLogout = async () => {
    try {
      await axios.post('/api/admin/logout');
    } catch {
    } finally {
      sessionStorage.removeItem('activeAdminMenu'); 
      sessionStorage.removeItem('activeTeknisiMenu'); 
      sessionStorage.removeItem('userRole'); 
      sessionStorage.clear(); 
      navigate("/portal-rhs-disdik-plw");
      window.location.reload();
    }
  };

  const userProfile = {
    name: isSuperAdmin ? "Super Administrator" : "Admin Disdikbud",
    role: isSuperAdmin ? "Kepala/Super" : "Operator",
    avatarUrl: `https://ui-avatars.com/api/?name=${isSuperAdmin ? 'Super+Admin' : 'Admin+Disdikbud'}&background=6366f1&color=fff`,
    location: "Palu, Sulawesi Tengah",
    status: "online" as const, 
    stats: { projects: 15, followers: isSuperAdmin ? 'Super Admin' : 'Admin' }
  };

  return (
    <ThemeContextAdmin.Provider value={{ theme, toggleTheme }}>
      <div
        className={`relative flex min-h-screen w-full overflow-hidden transition-colors duration-500 ${
          theme === "light" ? "bg-slate-50" : "bg-[#0a0a0a]"
        }`}
      >
        {/* Latar Belakang Gelap untuk Mobile Sidebar (Overlay) */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR LAYOUT
          Pemisahan layout: Fixed z-50 di mobile, statis di desktop
        */}
        <div className={`fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:relative transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
          <Sidebar 
            activeMenu={activeMenu} 
            setActiveMenu={setActiveMenu} 
            theme={theme} 
            userRole={userRole}
          />
        </div>

        {/* MAIN CONTENT LAYOUT 
          Menggunakan min-w-0 untuk menahan flexbox agar tidak menyebabkan scroll horizontal
        */}
        <main className="flex-1 flex flex-col h-screen min-w-0">
          
          {/* Header Tambahan untuk Mobile: Tombol Toggle Sidebar (Frame Statis) */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className={`p-2 rounded-lg ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-800'}`}
            >
              <Menu size={24} />
            </button>
            <span className={`font-bold ${theme === 'light' ? 'text-indigo-900' : 'text-white'}`}>
              Disdikbud Palu
            </span>
          </div>

          {/* Wrapper Topbar (Frame Statis) */}
          <div className="px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 shrink-0">
            <Topbar 
                setActiveMenu={setActiveMenu} 
                onLogoutRequest={() => setShowLogoutConfirm(true)}
            />
          </div>

          {/* Wrapper Konten Utama (Area yang Bisa di-Scroll) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 scrollbar-hide">
            <div className="animate-fade-in-up mt-2">
              
              {/* 4. RENDER GUARD KHUSUS ADMIN BIASA */}
              {!isSuperAdmin && activeMenu === "dashboard" && (
                <div className={`p-6 md:p-8 rounded-2xl md:rounded-3xl text-center border-2 border-dashed ${theme === 'light' ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-700 bg-gray-800/50'}`}>
                  <h2 className={`text-xl md:text-2xl font-bold mb-2 ${theme === 'light' ? 'text-indigo-900' : 'text-white'}`}>
                    Selamat datang di Dashboard Admin Disdikbud 🌿
                  </h2>
                  <p className={`text-sm md:text-base ${theme === 'light' ? 'text-indigo-500' : 'text-gray-400'}`}>
                    Login sebagai: <span className="font-bold uppercase">{userRole.replace('_', ' ')}</span>. Pilih menu untuk mengelola data.
                  </p>
                </div>
              )}

              {/* HALAMAN KONTEN ADMIN */}
              {!isSuperAdmin && (
                <div className={`transition-all duration-300 ${['dashboard', 'profile', 'password', 'panel-kontrol-layanan', 'tracking-activity'].includes(activeMenu) ? 'hidden' : 'block'}`}>
                  {/* overflow-x-auto ditahan hanya di kontainer konten, bukan ke seluruh body */}
                  <div className="w-full overflow-x-auto pb-4">
                    {/* Render komponen menu di sini */}
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
                    {activeMenu === "pengaturan" && <Pengaturan setActiveMenu={setActiveMenu} />}
                    {activeMenu === "agenda" && <AgendaControl />}
                    {activeMenu === "profil-pejabat" && <ControllPageProfile />}
                    {activeMenu === "kontrol-kalender" && <KontrolPanelKalender />}
                  </div>
                </div>
              )}

              {/* 5. MENU GLOBAL (Profile, Password, Pengaturan) */}
              {activeMenu === "profile" && (
                <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] py-6 md:py-10">
                   <div className="mb-6 text-center">
                      <h2 className={`text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Profil Saya</h2>
                      <p className="text-xs md:text-sm text-gray-500">Informasi detail akun</p>
                   </div>
                   <ProfilAvatar {...userProfile} />
                </div>
              )}

              {activeMenu === "password" && (
                <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] py-6 md:py-10">
                   <div className="mb-6 text-center">
                      <h2 className={`text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Keamanan</h2>
                      <p className="text-xs md:text-sm text-gray-500">Update password untuk keamanan akun</p>
                   </div>
                   <ChangePassword />
                </div>
              )}

              {isSuperAdmin && activeMenu === "pengaturan" && (
                  <div className="animate-fade-in-up w-full overflow-x-auto">
                      <Pengaturan setActiveMenu={setActiveMenu} />
                  </div>
              )}

              {/* 6. HALAMAN KHUSUS TEKNISI */}
              {isSuperAdmin && activeMenu === "panel-kontrol-layanan" && (
                  <div className="w-full overflow-x-auto"><PanelKontrolLayanan /></div>
              )}

              {isSuperAdmin && activeMenu === "tracking-activity" && (
                  <div className="w-full overflow-x-auto"><TrackingActivity /></div>
              )}

              {/* Guard/Pesan Penolakan */}
              {!isSuperAdmin && (activeMenu === "panel-kontrol-layanan" || activeMenu === "tracking-activity") && (
                  <div className="flex flex-col items-center justify-center h-[300px] md:h-[500px] text-center px-4 animate-in zoom-in duration-300">
                    <Lock className="w-16 h-16 md:w-20 md:h-20 text-rose-500 mb-4 opacity-50" />
                    <h2 className={`text-xl md:text-2xl font-bold mb-2 ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>Akses Ditolak</h2>
                    <p className="text-sm md:text-base text-slate-500 max-w-md">Anda tidak memiliki izin Teknisi/Super Admin untuk mengakses halaman ini.</p>
                  </div>
              )}

            </div>
          </div>
        </main>

        {/* ✅ WIDGET CHAT TEKNISI */}
        {!isSuperAdmin && (
            <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
              <ChatHelp />
            </div>
        )}

        {/* LOGOUT CONFIRMATION POPUP */}
        {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center w-screen h-screen bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl p-6 transform transition-all scale-100 ${
                theme === "light" ? "bg-white" : "bg-gray-800 border border-gray-700"
          }`}>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-500">
                <AlertTriangle size={24} />
              </div>
              
              <h3 className={`text-lg font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Konfirmasi Keluar
              </h3>
              <p className={`text-sm mb-6 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                Apakah Anda yakin ingin keluar dari sesi ini?
              </p>

              <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    theme === 'light' 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </ThemeContextAdmin.Provider>
  );
}