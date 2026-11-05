import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "@/Components/Layout/Navbar/Navbar";
import Footer from "@/Components/Layout/Footer/Footer";

const PublicLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ===============================
  // 1. DETEKSI HALAMAN
  // ===============================
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname.startsWith("/portal-rhs-disdik-plw");

  // ===============================
  // 2. STATE NAVBAR
  // ===============================
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // ===============================
  // 3. LOGIKA NAVIGASI (FULL MAP)
  // ===============================
  const onMenuClick = (menu: string, item: string) => {
    setActiveDropdown(null);
    const slug = item.toLowerCase().trim();

    // Mapping lengkap sesuai Routes.jsx Anda
    const urlMap: { [key: string]: string } = {
      // MENU UTAMA
      "beranda": "/",
      
      // PROFIL
      "sejarah": "/sejarah",
      "visi misi": "brand-identity",
      "struktur organisasi": "/profile",
      
      // PUBLIKASI
      "berita": "/berita",
      "kalender": "/kalender",
      "dokumentasi": "/dokumentasi",

      // LAYANAN UTAMA
      "paud dan pnf": "/paud",
      "sd": "/sd",
      "smp": "/smp",
      "ketenagaan gtk": "/ketenagaan",
      "sub-bagian umum dan kepegawaian": "/kepegawaian",
      "perencanaan dan program": "/perencanaan",
      "sub-sekretariat": "/sub-sekretariat",
      "aset dan keuangan": "/aset-dan-keuangan",
      "kebudayaan": "/kebudayaan",
    };

    if (urlMap[slug]) {
      navigate(urlMap[slug]);
    } else {
      // Jika user klik menu yang belum ada di map, log ke console biar gampang debug
      console.warn(`URL Map Missing for: ${slug}`);
      // Opsional: Coba navigasi otomatis jika nama menu == nama route
      // navigate(`/${slug.replace(/\s+/g, '-')}`); 
    }
  };

  // ===============================
  // 4. RENDER
  // ===============================
  return (
    <div className="min-h-screen flex flex-col relative">
      
      {/* Navbar Wrapper */}
      {!isAdminRoute && !isLoginPage && (
        <header className="sticky top-0 z-50 w-full">
          <Navbar
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            // Menu Definition
            dropdownMenus={{
              profil: ["Sejarah", "Visi Misi", "Struktur Organisasi"],
              layanan: {
                "Layanan Akademik": ["PAUD Dan PNF", "SD", "SMP"],
                "Birokrasi & SDM": [
                  "Ketenagaan GTK",
                  "Sub-Bagian Umum dan Kepegawaian",
                  "Perencanaan Dan Program",
                  "Sub-Sekretariat"
                ],
                "Fasilitas & Publik": [
                  "Aset dan Keuangan",
                  "Kebudayaan",
                ]
              },
              publikasi: ["Berita", "Kalender", "Dokumentasi"]
            }}
            onMenuClick={onMenuClick}
          />
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-0">
        <Outlet />
      </main>

      {/* Footer */}
      {!isAdminRoute && !isLoginPage && <Footer />}
    </div>
  );
};

export default PublicLayout;