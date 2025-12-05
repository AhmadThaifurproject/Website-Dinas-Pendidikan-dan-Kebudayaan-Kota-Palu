import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState,  ReactNode } from "react";
import { motion } from 'framer-motion';
import { useInView } from "react-intersection-observer";
import { BrowserRouter,Routes, Route, useNavigate,  useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar.tsx";
import Footer from "./Components/Footer";
import FormLoginTW from "./Components/FormLoginTW.tsx";
import {
  School,
  BookOpen,
  Users,
  Building2,
  Star,
} from "lucide-react";

import ProfilePage from "./pages/Public/ProfilePage.tsx";
import BrandIdentityPage from "./pages/Public/BrandIdentityPage.tsx";
import SejarahPage from "./pages/Public/SejarahPage.tsx";
import KalenderPage from "./pages/Public/KalenderPage.tsx";
import DokumentasiPage from "./pages/Public/DokumentasiPage.tsx";
import KepegawaianPage from "./pages/Public/LayananKepegawaianPage.tsx";
import PerencanaanPage from "./pages/Public/LayananPerencanaanPage.tsx";
import KetenagaanPage from "./pages/Public/LayananKetenagaanPage.tsx";
import KebudayaanPage from "./pages/Public/LayananKebudayaanPage.tsx";
import PaudPage from "./pages/Public/LayananPaudPage.tsx";
import SdPage from "./pages/Public/LayananSDPage.tsx";
import SmpPage from "./pages/Public/LayananSMPPage.tsx";
import SubSekretariatPage from "./pages/Public/LayananSubSekretariatPage.tsx";
import AsetKeuanganPage from "./pages/Public/LayananAsetKeuanganPage.tsx";
import BeritaPage from "./pages/Public/BeritaPage.tsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.tsx";
import Berita from "./pages/Admin/Konten/Berita.tsx";
import DetailBerita from "./pages/Admin/Konten/DetailBerita.tsx"
import LayananPPDBPage from './pages/Public/Konten_Layanan_SMP/LayananPPDBPage.tsx';
import LayananBOS from './pages/Public/Konten_Layanan_SMP/LayananBOS.tsx';
import LayananDataSekolah from './pages/Public/Konten_Layanan_SMP/LayananDataSekolah.tsx';
import LayananLegalisir from './pages/Public/Konten_Layanan_SMP/LayananLegalisir.tsx';
import LayananMutasiSiswa from './pages/Public/Konten_Layanan_SMP/LayananMutasiSiswaPage.tsx';
import LayananSapras from './pages/Public/Konten_Layanan_SMP/LayananSapras.tsx';
import LayananSuket from './pages/Public/Konten_Layanan_SMP/LayananSuket.tsx';
import LayananSuketGantijazah from './pages/Public/Konten_Layanan_SMP/LayananSuketGantijazah.tsx';

//Import SD :
import LayananBosSD from './pages/Public/Konten_Layanan_SD/LayananBosSD.tsx';
import LayananDataSekolahSD from './pages/Public/Konten_Layanan_SD/LayananDataSekolahSD.tsx';
import LayananLegalisirSD from './pages/Public/Konten_Layanan_SD/LayananLegalisirSD.tsx';
import LayananMutasiSiswaSD from './pages/Public/Konten_Layanan_SD/LayananMutasiSiswaSD.tsx';
import LayananPpdbSD from './pages/Public/Konten_Layanan_SD/LayananPpdbSD.tsx';
import LayananSaprasSD from './pages/Public/Konten_Layanan_SD/LayananSaprasSD.tsx';
import LayananSuketGantijazahSD from './pages/Public/Konten_Layanan_SD/LayananSuketGantijazahSD.tsx';
import LayananSuketSD from './pages/Public/Konten_Layanan_SD/LayananSuketSD.tsx';
//Import Ketenagaan&GTK
import LayananBimbinganKarier from "./pages/Public/Konten_Layanan_Ketenagaan_GTK/LayananBimbinganKarier.tsx";
import LayananCutiPegawai from "./pages/Public/Konten_Layanan_Ketenagaan_GTK/LayananCutiPegawai.tsx";
import LayananELKP from "./pages/Public/Konten_Layanan_Ketenagaan_GTK/LayananELKP.tsx";
import LayananKarpeg from "./pages/Public/Konten_Layanan_Ketenagaan_GTK/LayananKarpeg.tsx";
import LayananKenaikanPangkat from "./pages/Public/Konten_Layanan_Ketenagaan_GTK/LayananKenaikanPangkat.tsx";
import LayananMutasiRotasi from "./pages/Public/Konten_Layanan_Ketenagaan_GTK/LayananMutasiRotasi.tsx";
import LayananNUPTK from "./pages/Public/Konten_Layanan_Ketenagaan_GTK/LayananNUPTK.tsx";
import LayananPensiun from "./pages/Public/Konten_Layanan_Ketenagaan_GTK/LayananPensiun.tsx";
import LayananSertifikasiPendidik from "./pages/Public/Konten_Layanan_Ketenagaan_GTK/LayananSertifikasiPendidik.tsx";
import LayananSKCPNSPNS from "./pages/Public/Konten_Layanan_Ketenagaan_GTK/LayananSKCPNSPNS.tsx";
//Import Umum&Kepegawaian 
import LayananCutiUmrohHajiMelahirkan from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananCutiUmrohHajiMelahirkan.tsx";
import LayananIzinBelajar from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananIzinBelajar.tsx";
import LayananIzinCerai from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananIzinCerai.tsx";
import LayananKarpegUK from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananKarpegUK.tsx";
import LayananKenaikanPangkatUK from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananKenaikanPangkatUK.tsx";
import LayananMutasiGuru from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananMutasiGuru.tsx";
import LayananMutasiRotasiUK from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananMutasiRotasiUK.tsx";
import LayananPengaduanMasyarakat from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananPengaduanMasyarakat.tsx";
import LayananPensiunUK from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananPensiunUK.tsx";
import LayananRekomendasiIzinPenelitian from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananRekomendasiIzinPenelitian.tsx";
import LayananSatyaLencanaKaryaSatya from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananSatyaLencanaKaryaSatya.tsx";
import LayananSKCpnsPns from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananSKCpnsPns.tsx";
import LayananSKGajiBerkala from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananSKGajiBerkala.tsx";
import LayananSKJabatanGuru from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananSKJabatanGuru.tsx";
import LayananSKJabatanKenaikanFungsional from "./pages/Public/Konten_Layanan_Umum_Kepegawaian/LayananSKJabatanKenaikanFungsional.tsx";
//Import Kebudayaan
import LayananInformasiKantor from './pages/Public/Konten_Layanan_Kebudayaan/LayananInformasiKantor';
import LayananIzinBerkunjung from './pages/Public/Konten_Layanan_Kebudayaan/LayananIzinBerkunjung';
import LayananNomorInduk from './pages/Public/Konten_Layanan_Kebudayaan/LayananNomorInduk';
import LayananPendataan from './pages/Public/Konten_Layanan_Kebudayaan/LayananPendataan';
import LayananPenemuanObjek from './pages/Public/Konten_Layanan_Kebudayaan/LayananPenemuanObjek';
import LayananPengembanganSitus from './pages/Public/Konten_Layanan_Kebudayaan/LayananPengembanganSitus';
import LayananPenggunaanHalaman from './pages/Public/Konten_Layanan_Kebudayaan/LayananPenggunaanHalaman';
import LayananSosialMedia from './pages/Public/Konten_Layanan_Kebudayaan/LayananSosialMedia.tsx'
//Perencanaan&Program
import LayananApprovalNUPTK from "./pages/Public/Konten_Layanan_Perencanaan_Program/LayananApprovalNUPTK";
import LayananDAPODIK from "./pages/Public/Konten_Layanan_Perencanaan_Program/LayananDAPODIK";
import LayananNISN from "./pages/Public/Konten_Layanan_Perencanaan_Program/LayananNISN";
import LayananNomorSatuanPendidikan from "./pages/Public/Konten_Layanan_Perencanaan_Program/LayananNomorSatuanPendidikan";
import LayananNomorSatuanYayasan from "./pages/Public/Konten_Layanan_Perencanaan_Program/LayananNomorSatuanYayasan";
import LayananPengembanganSekolah from "./pages/Public/Konten_Layanan_Perencanaan_Program/LayananPengembanganSekolah";
import LayananPerencanaanAnggaran from "./pages/Public/Konten_Layanan_Perencanaan_Program/LayananPerencanaanAnggaran";

//Ini bagian Sub-Sekret
import LayananProgramKerja from './pages/Public/Konten_Layanan_SubSekretariat/LayananProgramKerja';
import LayananTugasFungsi from './pages/Public/Konten_Layanan_SubSekretariat/LayananTugasFungsi';

//Ini bagian Aset Dan Keuangan 
import LayananPengajuanGaji from "./pages/Public/Konten_Layanan_Aset dan Keuangan/LayananPengajuanGaji";
import LayananPengelolaanAset from "./pages/Public/Konten_Layanan_Aset dan Keuangan/LayananPengelolaanAset";
import LayananPengelolaanKeuangan from "./pages/Public/Konten_Layanan_Aset dan Keuangan/LayananPengelolaanKeuangan";
import LayananPerubahanPasswordPajak from "./pages/Public/Konten_Layanan_Aset dan Keuangan/LayananPerubahanPasswordPajak";
import LayananVerifikasiDanaBOP from "./pages/Public/Konten_Layanan_Aset dan Keuangan/LayananVerifikasiDanaBOP";




//Import PAUD & PNF 
import LayananBOSPaudNonFormal from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananBOSPaudNonFormal.tsx";
import LayananDanaBos from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananDanaBos.tsx";
import LayananDanaDak from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananDanaDak.tsx";
import LayananDapodikPaudPnf from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananDapodikPaudPnf.tsx";
import LayananDataLembagaPaud from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananDataLembagaPaud.tsx";
import LayananIzinPendirian from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananIzinPendirian.tsx";
import LayananLegalisirPaud from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananLegalisirPaud.tsx";
import LayananLegalisirSKHU from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananLegalisirSKHU.tsx";
import LayananMutasiPaud from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananMutasiPaud.tsx";
import LayananPendaftaranPaud from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananPendaftaranPaud.tsx";
import LayananRekomendasiPendirian from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananRekomendasiPendirian.tsx";
import LayananSuketPaud from "./pages/Public/Konten_Layanan_PAUD_PNF/LayananSuketPaud.tsx";



//Impor Pengaduan Masyarakat
import PengaduanMasyarakat from "./pages/Public/PengaduanMasyarakat.tsx";

// Import core Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import "animate.css";



function App() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>(window.location.pathname);
  const [highlightBerita, setHighlightBerita] = React.useState<NewsItem[]>([]);
  interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
}
const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, delay = 0 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};
  

  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/loginTW";

  interface NewsItem {
  id?: number;  // opsional kalau ada dari backend
  slug?: string;
  title: string;
  description: string;
  gambar: string;
  category: string;
  image_url: string | null; 
}
interface Poster {
  title: string;
  img: string;
  date: string;
  desc: string;
  link: string;
}

  const posters: Poster[] = [
  {
    title: "Festival Pendidikan 2025",
    img: "https://source.unsplash.com/800x600/?education,event",
    date: "12 September 2025",
    desc: "Saksikan berbagai lomba, pameran, dan seminar pendidikan untuk seluruh pelajar & guru.",
    link: "https://instagram.com/akun_disdikbud",
  },
  {
    title: "Workshop Kurikulum Merdeka",
    img: "https://source.unsplash.com/800x600/?school,training",
    date: "20 Oktober 2025",
    desc: "Pembekalan guru terkait penerapan Kurikulum Merdeka dan strategi pembelajaran inovatif.",
    link: "https://facebook.com/akun_disdikbud",
  },
];

  // Deteksi jika sedang di route admin
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDetailBeritaPage = location.pathname.startsWith("/berita/");

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPage(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  useEffect(() => {
  const fetchHighlight = () => {
    fetch("http://localhost:8000/api/berita/highlight")
      .then((res) => res.json())
      .then((data) => setHighlightBerita(data))
      .catch((err) => console.error("Gagal fetch highlight:", err));
  };

  fetchHighlight(); // langsung fetch pertama kali

  const interval = setInterval(fetchHighlight, 3000); // tiap 3 detik cek update
  return () => clearInterval(interval); // bersihkan interval saat unmount
}, []);

  const beritaPopuler = highlightBerita.filter(n => n.category === "populer");
  const beritaTerkini = highlightBerita.filter(n => n.category === "terkini");

  const services = [
    { title: "PAUD dan PNF", icon: <School className="w-12 h-12" /> },
    { title: "SD", icon: <School className="w-12 h-12" /> },
    { title: "SMP", icon: <School className="w-12 h-12" /> },
    { title: "Ketenagaan GTK", icon: <Users className="w-12 h-12" /> },
    { title: "Sub-Bagian Umum dan Kepegawaian", icon: <Users className="w-12 h-12" /> },
    { title: "Kebudayaan", icon: <Star className="w-12 h-12" /> },
    { title: "Perencanaan dan Program", icon: <BookOpen className="w-12 h-12" /> },
    { title: "Sub-Sekretariat", icon: <Building2 className="w-12 h-12" /> },
    { title: "Aset dan Keuangan", icon: <Building2 className="w-12 h-12" /> },
  ];

  

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
    "Pengaduan Masyarakat": "/pengaduan-masyarakat",

  };

  const route = routes[item];
  if (route) {
    navigate(route);
  } else {
    console.warn("Route tidak ditemukan untuk:", item);
  }
};

  
  const HomeSection = () => (
    <>
      <section className="relative h-[900px] w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          effect="fade"
          fadeEffect={{ crossFade: true }}
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          className="h-full swiper-fade"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div
              className="h-full w-full relative bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url('public/images/bg beranda/SisiDepan.jpg')` }}
            >
              {/* Layer gelap */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
  
              {/* Text di tengah */}
              <div className="relative text-center text-white z-10">
                <motion.h1 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  Dinas Pendidikan dan Kebudayaan Kota Palu
                </motion.h1>
                <motion.h2 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="text-2xl md:text-4xl font-semibold"
                >
                  #Palukanamapande
                </motion.h2>
              </div>
            </div>
          </SwiperSlide>
  
          {/* Slide 2 */}
          <SwiperSlide>
            <div
              className="h-full w-full relative bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url('public/images/bg beranda/SisiSampingKiri.jpg')` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative text-center text-white z-10">
                <motion.h1 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  Dinas Pendidikan dan Kebudayaan Kota Palu
                </motion.h1>
                <motion.h2 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="text-2xl md:text-4xl font-semibold"
                >
                  #Palukanamapande
                </motion.h2>
              </div>
            </div>
          </SwiperSlide>
  
          {/* Slide 3 */}
          <SwiperSlide>
            <div
              className="h-full w-full relative bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url('public/images/bg beranda/Hardiknas.JPG')` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative text-center text-white z-10">
                <motion.h1 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  Dinas Pendidikan dan Kebudayaan Kota Palu
                </motion.h1>
                <motion.h2 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="text-2xl md:text-4xl font-semibold"
                >
                  #Palukanamapande
                </motion.h2>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
   </section>
{/* Wrapper global dengan background tetap */}
<div className="relative min-h-screen bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">

  {/* Highlight Berita Section */}
  <section className="py-24 relative">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-wide"
      >
        Highlight Berita
      </motion.h2>
      <p className="text-white/80 text-lg mb-12">Berita terbaru dan populer untuk Anda</p>

      {/* Grid 2 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Berita Populer */}
        <div className="w-full">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Berita Populer
          </h3>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            speed={1000}
            loop
            className="w-full max-w-md mx-auto h-[420px] rounded-3xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10"
          >
            {beritaPopuler.map((n, i) => (
              <SwiperSlide key={i}>
                <Link to={`/berita/${n.slug}`}>
                  <div className="relative w-full h-full group rounded-2xl overflow-hidden">
                    {n.image_url && (
                      <img
                        src={n.image_url}
                        alt={n.title}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-lg font-bold">{n.title}</h3>
                      <p className="text-sm mt-1 opacity-80 line-clamp-3">{n.description}</p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Berita Terkini */}
        <div className="w-full">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span> Berita Terkini
          </h3>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            speed={1000}
            loop
            className="w-full max-w-md mx-auto h-[420px] rounded-3xl overflow-hidden shadow-xl backdrop-blur-md bg-white/10"
          >
            {beritaTerkini.map((n, i) => (
              <SwiperSlide key={i}>
                <Link to={`/berita/${n.slug}`}>
                  <div className="relative w-full h-full group rounded-2xl overflow-hidden">
                    {n.image_url && (
                      <img
                        src={n.image_url}
                        alt={n.title}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-lg font-bold">{n.title}</h3>
                      <p className="text-sm mt-1 opacity-80 line-clamp-3">{n.description}</p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  </section>

  {/* Poster / Banner Section */}
  <section className="relative py-32">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.15, y: [-30, 0] }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true }}
      className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/dot-grid.png')]"
    />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <AnimatedItem>
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-4 tracking-wide">
          Info Kegiatan & Edukasi
        </h2>
      </AnimatedItem>
      <p className="text-center text-white/80 text-lg mb-16">
        Ikuti kegiatan terbaru dari Disdikbud
      </p>

      {/* Poster Showcase */}
      <Swiper
  modules={[]}
  loop={false}
  autoplay={false}
  slidesPerView={1}
  spaceBetween={50}
  className="w-full max-w-5xl mx-auto"
>
  {posters.map((poster, i) => (
    <SwiperSlide key={i}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl p-6">
        {/* Kiri: Poster */}
        <AnimatedItem>
          <img
            src={poster.img}
            alt={poster.title}
            className="w-full h-[420px] object-cover rounded-2xl"
          />
        </AnimatedItem>

        {/* Kanan: Deskripsi */}
        <div className="flex flex-col justify-center text-white">
          <AnimatedItem>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-md">
              {poster.title}
            </h3>
          </AnimatedItem>

          <AnimatedItem>
            <p className="mb-2 text-sm md:text-base opacity-90">📅 {poster.date}</p>
          </AnimatedItem>

          <AnimatedItem>
            <p className="text-sm md:text-base opacity-95 leading-relaxed mb-6">
              {poster.desc}
            </p>
          </AnimatedItem>

          <AnimatedItem>
            <a
              href={poster.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white font-semibold shadow-md hover:scale-105 transition"
            >
              Baca Selengkapnya →
            </a>
          </AnimatedItem>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>



    </div>
  </section>

</div>




    </>
  );
  

   return (
  <>
    {/* ✅ Tampilkan Navbar hanya jika bukan di halaman admin, detail berita, dan login */}
    {!isAdminRoute && !isLoginPage && (
      <Navbar
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        dropdownMenus={{
          profil: ["Sejarah", "Visi Misi", "Struktur Organisasi"],
          layanan: [
            "PAUD Dan PNF", "SD", "SMP", "Ketenagaan GTK", "Sub-Bagian Umum dan Kepegawaian",
            "Kebudayaan", "Perencanaan Dan Program", "Sub-Sekretariat", "Aset dan Keuangan", "Pengaduan Masyarakat"
          ],
          publikasi: ["Berita", "Kalender", "Dokumentasi"]
        }}
        onMenuClick={onMenuClick}
      />
    )}

    {/* ✅ Semua Routing halaman */}
    
    <Routes>
      <Route path="/" element={<HomeSection />} />
      <Route path="/beranda" element={<HomeSection />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/brand-identity" element={<BrandIdentityPage />} />
      <Route path="/sejarah" element={<SejarahPage />} />
      <Route path="/kalender" element={<KalenderPage />} />
      <Route path="/dokumentasi" element={<DokumentasiPage />} />
      <Route path="/kepegawaian" element={<KepegawaianPage />} />
      <Route path="/perencanaan" element={<PerencanaanPage />} />
      <Route path="/ketenagaan" element={<KetenagaanPage />} />
      <Route path="/kebudayaan" element={<KebudayaanPage />} />
      <Route path="/paud" element={<PaudPage />} />
      <Route path="/sd" element={<SdPage />} />
      <Route path="/smp" element={<SmpPage />} />
      <Route path="/sub-sekretariat" element={<SubSekretariatPage />} />
      <Route path="/aset-dan-keuangan" element={<AsetKeuanganPage />} />
      <Route path="/berita" element={<BeritaPage />} />
      <Route path="/berita/:slug" element={<DetailBerita />} />
      <Route path="/layanan/bos" element={<LayananBOS />} />
      <Route path="/layanan/data-sekolah" element={<LayananDataSekolah />} />
      <Route path="/layanan/legalisir" element={<LayananLegalisir />} />
      <Route path="/layanan/mutasi-siswa" element={<LayananMutasiSiswa />} />
      <Route path="/layanan/sapras" element={<LayananSapras />} />
      <Route path="/layanan/suket" element={<LayananSuket />} />
      <Route path="/layanan/suket-gantijazah" element={<LayananSuketGantijazah />} />
      <Route path="/layanan/ppdb" element={<LayananPPDBPage />} />
       {/* Pengaduan Masyarakat */}
      <Route path="/pengaduan-masyarakat" element={<PengaduanMasyarakat />} />
      {/* ini bagian paud */}
      <Route path="/paud/layanan/bos" element={<LayananBOSPaudNonFormal />} />
      <Route path="/paud/layanan/dana-bos" element={<LayananDanaBos />} />
      <Route path="/paud/layanan/dak" element={<LayananDanaDak />} />
      <Route path="/paud/layanan/dapodik" element={<LayananDapodikPaudPnf />} />
      <Route path="/paud/layanan/data-lembaga" element={<LayananDataLembagaPaud />} />
      <Route path="/paud/layanan/izin-pendirian" element={<LayananIzinPendirian />} />
      <Route path="/paud/layanan/legalisir-ijazah" element={<LayananLegalisirPaud />} />
      <Route path="/paud/layanan/legalisir-skhu" element={<LayananLegalisirSKHU />} />
      <Route path="/paud/layanan/mutasi" element={<LayananMutasiPaud />} />
      <Route path="/paud/layanan/pendaftaran" element={<LayananPendaftaranPaud />} />
      <Route path="/paud/layanan/rekomendasi-pendirian" element={<LayananRekomendasiPendirian />} />
      <Route path="/paud/layanan/suket" element={<LayananSuketPaud />} />
      {/* ini bagian ketenagaan & gtk*/}
      <Route path="/ketenagaan-gtk/layanan/bimbingan-karier" element={<LayananBimbinganKarier />} />
      <Route path="/ketenagaan-gtk/layanan/cuti-pegawai" element={<LayananCutiPegawai />} />
      <Route path="/ketenagaan-gtk/layanan/elkp" element={<LayananELKP />} />
      <Route path="/ketenagaan-gtk/layanan/kartu-pegawai" element={<LayananKarpeg />} />
      <Route path="/ketenagaan-gtk/layanan/kenaikan-pangkat" element={<LayananKenaikanPangkat />} />
      <Route path="/ketenagaan-gtk/layanan/mutasi-rotasi" element={<LayananMutasiRotasi />} />
      <Route path="/ketenagaan-gtk/layanan/nuptk" element={<LayananNUPTK />} />
      <Route path="/ketenagaan-gtk/layanan/pensiun" element={<LayananPensiun />} />
      <Route path="/ketenagaan-gtk/layanan/sertifikasi-pendidik" element={<LayananSertifikasiPendidik />} />
      <Route path="/ketenagaan-gtk/layanan/skcpns-pns" element={<LayananSKCPNSPNS />} />
      {/* Ini bagian umum&kepegawaian */}
      <Route path="/umum-kepegawaian/layanan/cuti-umroh-haji-melahirkan" element={<LayananCutiUmrohHajiMelahirkan />} />
      <Route path="/umum-kepegawaian/layanan/izin-belajar" element={<LayananIzinBelajar />} />
      <Route path="/umum-kepegawaian/layanan/izin-cerai" element={<LayananIzinCerai />} />
      <Route path="/umum-kepegawaian/layanan/kartu-pegawai" element={<LayananKarpegUK />} />
      <Route path="/umum-kepegawaian/layanan/kenaikan-pangkat" element={<LayananKenaikanPangkatUK />} />
      <Route path="/umum-kepegawaian/layanan/mutasi-guru" element={<LayananMutasiGuru />} />
      <Route path="/umum-kepegawaian/layanan/mutasi-rotasi" element={<LayananMutasiRotasiUK />} />
      <Route path="/umum-kepegawaian/layanan/pengaduan-masyarakat" element={<LayananPengaduanMasyarakat />} />
      <Route path="/umum-kepegawaian/layanan/pensiun" element={<LayananPensiunUK />} />
      <Route path="/umum-kepegawaian/layanan/rekomendasi-izin-penelitian" element={<LayananRekomendasiIzinPenelitian />} />
      <Route path="/umum-kepegawaian/layanan/satya-lencana-karya-satya" element={<LayananSatyaLencanaKaryaSatya />} />
      <Route path="/umum-kepegawaian/layanan/sk-cpns-pns" element={<LayananSKCpnsPns />} />
      <Route path="/umum-kepegawaian/layanan/sk-gaji-berkala" element={<LayananSKGajiBerkala />} />
      <Route path="/umum-kepegawaian/layanan/sk-jabatan-guru" element={<LayananSKJabatanGuru />} />
      <Route path="/umum-kepegawaian/layanan/sk-jabatan-kenaikan-fungsional" element={<LayananSKJabatanKenaikanFungsional />} />
      {/* Ini bagian Kebudayaan */}
      <Route path="/kebudayaan/layanan/informasi-kantor" element={<LayananInformasiKantor />} />
      <Route path="/kebudayaan/layanan/izin-berkunjung" element={<LayananIzinBerkunjung />} />
      <Route path="/kebudayaan/layanan/nomor-induk" element={<LayananNomorInduk />} />
      <Route path="/kebudayaan/layanan/pendataan" element={<LayananPendataan />} />
      <Route path="/kebudayaan/layanan/penemuan-objek" element={<LayananPenemuanObjek />} />
      <Route path="/kebudayaan/layanan/pengembangan-situs" element={<LayananPengembanganSitus />} />
      <Route path="/kebudayaan/layanan/penggunaan-halaman" element={<LayananPenggunaanHalaman />} />
      <Route path="/kebudayaan/layanan/informasi-sosial" element={<LayananSosialMedia/>} />
      {/* Ini bagian perencanaan&program */}
      <Route path="/perencanaan-program/layanan/approval-nuptk" element={<LayananApprovalNUPTK />} />
      <Route path="/perencanaan-program/layanan/dapodik" element={<LayananDAPODIK />} />
      <Route path="/perencanaan-program/layanan/nisn" element={<LayananNISN />} />
      <Route path="/perencanaan-program/layanan/nomor-satuan-pendidikan" element={<LayananNomorSatuanPendidikan />} />
      <Route path="/perencanaan-program/layanan/nomor-satuan-yayasan" element={<LayananNomorSatuanYayasan />} />
      <Route path="/perencanaan-program/layanan/pengembangan-sekolah" element={<LayananPengembanganSekolah />} />
      <Route path="/perencanaan-program/layanan/perencanaan-anggaran" element={<LayananPerencanaanAnggaran />} />
      {/* Ini bagian Sub-Sekretariat */}
      <Route path="/sub-sekretariat/layanan/program-kerja" element={<LayananProgramKerja />} />
      <Route path="/sub-sekretariat/layanan/tugas-fungsi" element={<LayananTugasFungsi />} />
      {/* Ini bagian aset dan keuangan */}
      <Route path="/aset-dan-keuangan/layanan/pengajuan-gaji" element={<LayananPengajuanGaji />} />
      <Route path="/aset-dan-keuangan/layanan/pengelolaan-aset" element={<LayananPengelolaanAset />} />
      <Route path="/aset-dan-keuangan/layanan/pengelolaan-keuangan" element={<LayananPengelolaanKeuangan />} />
      <Route path="/aset-dan-keuangan/layanan/perubahan-password-pajak" element={<LayananPerubahanPasswordPajak />} />
      <Route path="/aset-dan-keuangan/layanan/verifikasi-dana-bop" element={<LayananVerifikasiDanaBOP />} />
     
      {/* ✅ Route SD */}
      <Route path="/sd/layanan/bos" element={<LayananBosSD />} />
      <Route path="/sd/layanan/data-sekolah" element={<LayananDataSekolahSD />} />
      <Route path="/sd/layanan/legalisir" element={<LayananLegalisirSD />} />
      <Route path="/sd/layanan/mutasi-siswa" element={<LayananMutasiSiswaSD />} />
      <Route path="/sd/layanan/ppdb" element={<LayananPpdbSD />} />
      <Route path="/sd/layanan/sapras" element={<LayananSaprasSD />} />
      <Route path="/sd/layanan/suket-gantijazah" element={<LayananSuketGantijazahSD />} />
      <Route path="/sd/layanan/suket" element={<LayananSuketSD />} />
      <Route path="/berita/:slug" element={<DetailBerita />} />
      <Route path="/loginTW" element={<FormLoginTW />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/berita" element={<Berita />} />
    </Routes>

    {/* ✅ Tampilkan Footer hanya jika bukan di halaman admin, detail berita, dan login */}
    {!isAdminRoute && !isLoginPage && <Footer />}
  </>
);

}

export default App;
