// App.tsx
import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// --- Systems ---
import NotFound from './feature/auth/features/NotFound.tsx';
import StealthRoute from './Components/Feedback/StealthRoute.tsx';


// --- Components & LAYOUT ---
import PublicLayout from "@/Components/Layout/PublicLayout";

// --- HOMEPAGE  ---
import HomePage from "./pages/Public/Home/homepage.tsx"; 

// --- AUTH ---
import Login from "./feature/auth/loginpage.tsx";

// --- Profil Admin ---
import ProfilAvatar from "./pages/Admin/Components/profil/Components/ProfilAvatar.tsx";
import ChangePassword from "./pages/Admin/Components/profil/Components/ChangePassword.tsx";

// --- PAGES: PUBLIC (PROFIL) ---
import ProfilePage from "./pages/Public/konten/Profil/ProfilePage.tsx";
import BrandIdentityPage from "./pages/Public/konten/BrandIdentityPage.tsx";
import SejarahPage from "./pages/Public/konten/Profil/SejarahPage.tsx";
import KalenderPage from "./pages/Public/konten/KalenderPage.tsx";
import DokumentasiPage from "./pages/Public/konten/DokumentasiPage.tsx";

// --- PAGES: PUBLIC (LAYANAN UTAMA) ---
import KepegawaianPage from "./pages/Public/layanan/LayananKepegawaianPage.tsx";
import PerencanaanPage from "./pages/Public/layanan/LayananPerencanaanPage.tsx";
import KetenagaanPage from "./pages/Public/layanan/LayananKetenagaanPage.tsx";
import KebudayaanPage from "./pages/Public/layanan/LayananKebudayaanPage.tsx";
import PaudPage from "./pages/Public/layanan/LayananPaudPage.tsx";
import SdPage from "./pages/Public/layanan/LayananSDPage.tsx";
import SmpPage from "./pages/Public/layanan/LayananSMPPage.tsx";
import SubSekretariatPage from "./pages/Public/layanan/LayananSubSekretariatPage.tsx";
import AsetKeuanganPage from "./pages/Public/layanan/LayananAsetKeuanganPage.tsx";
import BeritaPage from "./pages/Public/konten/BeritaPage.tsx";

// --- PAGES: ADMIN ---
import AdminDashboard from "./Components/Layout/Admin/dashboard/AdminDashboard.tsx";
import Berita from "./pages/Admin/Konten/berita/Berita.tsx";
import DetailBerita from "./pages/Admin/Konten/berita/DetailBerita.tsx";

// --- PAGES: LAYANAN RINCIAN (SMP) ---
import LayananPPDBPage from './pages/Public/konten/layanan-informasi/smp/LayananPPDBPage.tsx';
import LayananBOS from './pages/Public/konten/layanan-informasi/smp/LayananBOS.tsx';
import LayananDataSekolah from './pages/Public/konten/layanan-informasi/smp/LayananDataSekolah.tsx';
import LayananLegalisir from './pages/Public/konten/layanan-informasi/smp/LayananLegalisir.tsx';
import LayananMutasiSiswa from './pages/Public/konten/layanan-informasi/smp/LayananMutasiSiswaPage.tsx';
import LayananSapras from './pages/Public/konten/layanan-informasi/smp/LayananSapras.tsx';
import LayananSuket from './pages/Public/konten/layanan-informasi/smp/LayananSuket.tsx';
import LayananSuketGantijazah from './pages/Public/konten/layanan-informasi/smp/LayananSuketGantijazah.tsx';

// --- PAGES: LAYANAN RINCIAN (SD) ---
import LayananBosSD from './pages/Public/konten/layanan-informasi/sd/LayananBosSD.tsx';
import LayananDataSekolahSD from './pages/Public/konten/layanan-informasi/sd/LayananDataSekolahSD.tsx';
import LayananLegalisirSD from './pages/Public/konten/layanan-informasi/sd/LayananLegalisirSD.tsx';
import LayananMutasiSiswaSD from './pages/Public/konten/layanan-informasi/sd/LayananMutasiSiswaSD.tsx';
import LayananPpdbSD from './pages/Public/konten/layanan-informasi/sd/LayananPpdbSD.tsx';
import LayananSaprasSD from './pages/Public/konten/layanan-informasi/sd/LayananSaprasSD.tsx';
import LayananSuketGantijazahSD from './pages/Public/konten/layanan-informasi/sd/LayananSuketGantijazahSD.tsx';
import LayananSuketSD from './pages/Public/konten/layanan-informasi/sd/LayananSuketSD.tsx';

// --- PAGES: LAYANAN RINCIAN (KETENAGAAN & GTK) ---
import LayananNUPTK from "./pages/Public/konten/layanan-informasi/ketenagaan/LayananNUPTK.tsx";
import LayananSertifikasiPendidik from "./pages/Public/konten/layanan-informasi/ketenagaan/LayananSertifikasiPendidik.tsx";

// --- PAGES: LAYANAN RINCIAN (UMUM & KEPEGAWAIAN) ---
import LayananCutiUmrohHajiMelahirkan from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananCutiUmrohHajiMelahirkan.tsx";
import LayananIzinBelajar from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananIzinBelajar.tsx";
import LayananIzinCerai from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananIzinCerai.tsx";
import LayananKenaikanPangkatUK from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananKenaikanPangkatReg.tsx";
import LayananMutasiGuru from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananMutasiGuru.tsx";
import LayananPensiunUK from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananPengajuanPensiun.tsx";
import LayananRekomendasiIzinPenelitian from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananRekomendasiIzinPenelitian.tsx";
import LayananSatyaLencanaKaryaSatya from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananSatyaLencanaKaryaSatya.tsx";
import LayananSKGajiBerkala from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananSKGajiBerkala.tsx";
import LayananSKJabatanGuru from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananSKJabatanGuru.tsx";
import LayananSKJabatanKenaikanFungsional from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananSKJabatanKenaikanFungsional.tsx";
import LayananBup from "./pages/Public/konten/layanan-informasi/umum-kepegawaian/LayananBup.tsx";

// --- PAGES: LAYANAN RINCIAN (KEBUDAYAAN) ---
import LayananInformasiKantor from './pages/Public/konten/layanan-informasi/kebudayaan/LayananInformasiKantor.tsx';
import LayananIzinBerkunjung from './pages/Public/konten/layanan-informasi/kebudayaan/LayananIzinBerkunjung.tsx';
import LayananNomorInduk from './pages/Public/konten/layanan-informasi/kebudayaan/LayananNomorInduk.tsx';
import LayananPendataan from './pages/Public/konten/layanan-informasi/kebudayaan/LayananPendataan.tsx';
import LayananPenemuanObjek from './pages/Public/konten/layanan-informasi/kebudayaan/LayananPenemuanObjek.tsx';
import LayananPengembanganSitus from './pages/Public/konten/layanan-informasi/kebudayaan/LayananPengembanganSitus.tsx';
import LayananPenggunaanHalaman from './pages/Public/konten/layanan-informasi/kebudayaan/LayananPenggunaanHalaman.tsx';
import LayananSosialMedia from './pages/Public/konten/layanan-informasi/kebudayaan/LayananSosialMedia.tsx'

// --- PAGES: LAYANAN RINCIAN (PERENCANAAN & PROGRAM) ---
import LayananApprovalNUPTK from "./pages/Public/konten/layanan-informasi/perencanaan-program/LayananApprovalNUPTK.tsx";
import LayananDAPODIK from "./pages/Public/konten/layanan-informasi/perencanaan-program/LayananDAPODIK.tsx";
import LayananNISN from "./pages/Public/konten/layanan-informasi/perencanaan-program/LayananNISN.tsx";
import LayananNomorSatuanPendidikan from "./pages/Public/konten/layanan-informasi/perencanaan-program/LayananNomorSatuanPendidikan.tsx";
import LayananNomorSatuanYayasan from "./pages/Public/konten/layanan-informasi/perencanaan-program/LayananNomorSatuanYayasan.tsx";

// --- PAGES: LAYANAN RINCIAN (SUB-SEKRETARIAT) ---
import LayananProgramKerja from './pages/Public/konten/layanan-informasi/sub-sekretariat/LayananProgramKerja.tsx';
import LayananTugasFungsi from './pages/Public/konten/layanan-informasi/sub-sekretariat/LayananTugasFungsi.tsx';

// --- PAGES: LAYANAN RINCIAN (ASET & KEUANGAN) ---
import LayananPengajuanGaji from "./pages/Public/konten/layanan-informasi/aset-keuangan/LayananPengajuanGaji.tsx";
import LayananPerubahanPasswordPajak from "./pages/Public/konten/layanan-informasi/aset-keuangan/LayananPerubahanPasswordPajak.tsx";
import LayananVerifikasiDanaBOP from "./pages/Public/konten/layanan-informasi/aset-keuangan/LayananVerifikasiDanaBOP.tsx";

// --- PAGES: LAYANAN RINCIAN (PAUD & PNF) ---
import BosSekolah from "./pages/Public/konten/layanan-informasi/paud-pnf/BosSekolah.tsx";
import DanaBosSapen from "./pages/Public/konten/layanan-informasi/paud-pnf/DanaBosSapen.tsx";
import LayananDanaDak from "./pages/Public/konten/layanan-informasi/paud-pnf/LayananDanaDak.tsx";
import RekomendasiPendirianSekolah from "./pages/Public/konten/layanan-informasi/paud-pnf/RekomendasiPendirianSekolah.tsx";
import UjianKesetaraan from "./pages/Public/konten/layanan-informasi/paud-pnf/UjianKesetaraan.tsx";
import LayananLegalisirSKHU from "./pages/Public/konten/layanan-informasi/paud-pnf/LayananLegalisirSKHU.tsx";
import RekomendasiLembagaKursus from "./pages/Public/konten/layanan-informasi/paud-pnf/RekomendasiLembagaKursus.tsx";
import IzinPenyelenggaraan from "./pages/Public/konten/layanan-informasi/paud-pnf/IzinPenyelenggaraan.tsx";
import Dapodik from "./pages/Public/konten/layanan-informasi/paud-pnf/Dapodik.tsx";

// Styles
import "animate.css";

function App() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Kondisi untuk menyembunyikan Navbar/Footer
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/loginTW";

  // Fungsi navigasi Menu (Tetap di App karena Navbar ada di sini)
  const onMenuClick = (_menu: string, item: string) => {
    const routes: Record<string, string> = {
      "Beranda": "/beranda",
      "Struktur Organisasi": "/profile",
      "PAUD Dan PNF": "/paud",
      "SD": "/sd",
      "SMP": "/smp",
      "Ketenagaan GTK": "/ketenagaan",
      "Sub-Bagian Umum dan Kepegawaian": "/kepegawaian",
      "Kebudayaan": "/kebudayaan",
      "Perencanaan Dan Program": "/perencanaan",
      "Sub-Sekretariat": "/sub-sekretariat",
      "Aset dan Keuangan": "/aset-dan-keuangan",
      "Berita": "/berita",
      "Kalender": "/kalender",
      "Dokumentasi": "/dokumentasi",
      "Sejarah": "/sejarah",
      "Visi Misi": "/brand-identity",
    };

    const route = routes[item];
    if (route) {
      navigate(route);
    } else {
      console.warn("Route tidak ditemukan untuk:", item);
    }
  };

 return (
  <Routes>
    {/* ========================================= */}
    {/* PUBLIC LAYOUT                */}
    {/* ========================================= */}
    <Route element={<PublicLayout />}>
      
      {/* --- Homepage --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/beranda" element={<HomePage />} />

      {/* --- Profil Instansi --- */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/brand-identity" element={<BrandIdentityPage />} />
      <Route path="/sejarah" element={<SejarahPage />} />
      <Route path="/kalender" element={<KalenderPage />} />
      <Route path="/dokumentasi" element={<DokumentasiPage />} />

      {/* --- Halaman Layanan Utama --- */}
      <Route path="/kepegawaian" element={<KepegawaianPage />} />
      <Route path="/perencanaan" element={<PerencanaanPage />} />
      <Route path="/ketenagaan" element={<KetenagaanPage />} />
      <Route path="/kebudayaan" element={<KebudayaanPage />} />
      <Route path="/paud" element={<PaudPage />} />
      <Route path="/sd" element={<SdPage />} />
      <Route path="/smp" element={<SmpPage />} />
      <Route path="/sub-sekretariat" element={<SubSekretariatPage />} />
      <Route path="/aset-dan-keuangan" element={<AsetKeuanganPage />} />
      
      {/* --- Berita --- */}
      <Route path="/berita" element={<BeritaPage />} />
      <Route path="/berita/:slug" element={<DetailBerita />} />

      {/* --- Rincian: SMP --- */}
      <Route path="/smp/layanan/bos" element={<LayananBOS />} />
      <Route path="/smp/layanan/data-sekolah" element={<LayananDataSekolah />} />
      <Route path="/smp/layanan/legalisir" element={<LayananLegalisir />} />
      <Route path="/smp/layanan/mutasi-siswa" element={<LayananMutasiSiswa />} />
      <Route path="/smp/layanan/sapras" element={<LayananSapras />} />
      <Route path="/smp/layanan/suket" element={<LayananSuket />} />
      <Route path="/smp/layanan/suket-gantijazah" element={<LayananSuketGantijazah />} />
      <Route path="/smp/layanan/ppdb" element={<LayananPPDBPage />} />

      {/* --- Rincian: PAUD --- */}
      <Route path="/paud/layanan/bos-satuan-pendidikan" element={<DanaBosSapen />} />
      <Route path="/paud/layanan/ujian-kesetaraan-paket" element={<UjianKesetaraan />} />
      <Route path="/paud/layanan/dak" element={<LayananDanaDak />} />
      <Route path="/paud/layanan/rekomendasi-lembaga-kursus" element={<RekomendasiLembagaKursus />} />
      <Route path="/paud/layanan/izin-penyelenggaraan" element={<IzinPenyelenggaraan />} />
      <Route path="/paud/layanan/legalisir-skhu" element={<LayananLegalisirSKHU />} />
      <Route path="/paud/layanan/dapodik" element={<Dapodik />} />
      <Route path="/paud/layanan/rekomendasi-pendirian-sekolah" element={<RekomendasiPendirianSekolah />} />
      <Route path="/paud/layanan/bos-sekolah" element={<BosSekolah />} />

      {/* --- Rincian: SD --- */}
      <Route path="/sd/layanan/bos" element={<LayananBosSD />} />
      <Route path="/sd/layanan/data-sekolah" element={<LayananDataSekolahSD />} />
      <Route path="/sd/layanan/legalisir" element={<LayananLegalisirSD />} />
      <Route path="/sd/layanan/mutasi-siswa" element={<LayananMutasiSiswaSD />} />
      <Route path="/sd/layanan/ppdb" element={<LayananPpdbSD />} />
      <Route path="/sd/layanan/sapras" element={<LayananSaprasSD />} />
      <Route path="/sd/layanan/suket-gantijazah" element={<LayananSuketGantijazahSD />} />
      <Route path="/sd/layanan/suket" element={<LayananSuketSD />} />

      {/* --- Rincian: Ketenagaan & GTK --- */}
      <Route path="/ketenagaan-gtk/layanan/nuptk" element={<LayananNUPTK />} />
      <Route path="/ketenagaan-gtk/layanan/sertifikasi-pendidik" element={<LayananSertifikasiPendidik />} />

      {/* --- Rincian: Umum & Kepegawaian --- */}
      <Route path="/umum-kepegawaian/layanan/cuti-umroh-haji-melahirkan" element={<LayananCutiUmrohHajiMelahirkan />} />
      <Route path="/umum-kepegawaian/layanan/izin-belajar" element={<LayananIzinBelajar />} />
      <Route path="/umum-kepegawaian/layanan/izin-cerai" element={<LayananIzinCerai />} />
      <Route path="/umum-kepegawaian/layanan/bup" element={<LayananBup />} />
      <Route path="/umum-kepegawaian/layanan/kenaikan-pangkat" element={<LayananKenaikanPangkatUK />} />
      <Route path="/umum-kepegawaian/layanan/mutasi-guru" element={<LayananMutasiGuru />} />
      <Route path="/umum-kepegawaian/layanan/pensiun" element={<LayananPensiunUK />} />
      <Route path="/umum-kepegawaian/layanan/rekomendasi-izin-penelitian" element={<LayananRekomendasiIzinPenelitian />} />
      <Route path="/umum-kepegawaian/layanan/satya-lencana-karya-satya" element={<LayananSatyaLencanaKaryaSatya />} />
      <Route path="/umum-kepegawaian/layanan/sk-gaji-berkala" element={<LayananSKGajiBerkala />} />
      <Route path="/umum-kepegawaian/layanan/sk-jabatan-guru" element={<LayananSKJabatanGuru />} />
      <Route path="/umum-kepegawaian/layanan/sk-jabatan-kenaikan-fungsional" element={<LayananSKJabatanKenaikanFungsional />} />

      {/* --- Rincian: Kebudayaan --- */}
      <Route path="/kebudayaan/layanan/informasi-kantor" element={<LayananInformasiKantor />} />
      <Route path="/kebudayaan/layanan/izin-berkunjung" element={<LayananIzinBerkunjung />} />
      <Route path="/kebudayaan/layanan/nomor-induk" element={<LayananNomorInduk />} />
      <Route path="/kebudayaan/layanan/pendataan" element={<LayananPendataan />} />
      <Route path="/kebudayaan/layanan/penemuan-objek" element={<LayananPenemuanObjek />} />
      <Route path="/kebudayaan/layanan/pengembangan-situs" element={<LayananPengembanganSitus />} />
      <Route path="/kebudayaan/layanan/penggunaan-halaman" element={<LayananPenggunaanHalaman />} />
      <Route path="/kebudayaan/layanan/informasi-sosial" element={<LayananSosialMedia />} />

      {/* --- Rincian: Perencanaan & Program --- */}
      <Route path="/perencanaan-program/layanan/approval-nuptk" element={<LayananApprovalNUPTK />} />
      <Route path="/perencanaan-program/layanan/dapodik" element={<LayananDAPODIK />} />
      <Route path="/perencanaan-program/layanan/nisn" element={<LayananNISN />} />
      <Route path="/perencanaan-program/layanan/nomor-satuan-pendidikan" element={<LayananNomorSatuanPendidikan />} />
      <Route path="/perencanaan-program/layanan/nomor-satuan-yayasan" element={<LayananNomorSatuanYayasan />} />

      {/* --- Rincian: Sub-Sekretariat --- */}
      <Route path="/sub-sekretariat/layanan/program-kerja" element={<LayananProgramKerja />} />
      <Route path="/sub-sekretariat/layanan/tugas-fungsi" element={<LayananTugasFungsi />} />

      {/* --- Rincian: Aset & Keuangan --- */}
      <Route path="/aset-dan-keuangan/layanan/pengajuan-gaji" element={<LayananPengajuanGaji />} />
      <Route path="/aset-dan-keuangan/layanan/perubahan-password-pajak" element={<LayananPerubahanPasswordPajak />} />
      <Route path="/aset-dan-keuangan/layanan/verifikasi-dana-bop" element={<LayananVerifikasiDanaBOP />} />

    </Route> {/* End PublicLayout */}


    {/* ========================================= */}
    {/* AUTH & ADMIN                  */}
    {/* ========================================= */}
    
    {/* Halaman Login */}
    <Route path="/portal-rhs-disdik-plw" element={<Login />} />

    {/* Protected Admin Routes */}
    <Route element={<StealthRoute />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/berita" element={<Berita />} />
      
      {/* Profil Admin */}
      <Route 
        path="/admin/profil" 
        element={
          <div className="flex justify-center p-10">
            <ProfilAvatar />
          </div>
        } 
      />
      {/* Ganti Password Admin */}
      <Route 
        path="/admin/password" 
        element={
          <div className="flex justify-center p-10">
            <ChangePassword />
          </div>
        } 
      />
    </Route>


    {/* ========================================= */}
    {/* NOT FOUND                   */}
    {/* ========================================= */}
    <Route path="*" element={<NotFound />} />
    
  </Routes>
);
}

export default App;