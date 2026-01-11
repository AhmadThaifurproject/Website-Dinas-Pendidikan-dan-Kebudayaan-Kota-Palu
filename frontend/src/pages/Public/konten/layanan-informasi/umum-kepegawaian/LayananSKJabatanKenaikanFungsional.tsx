// src/pages/Public/LayananKepegawaian/LayananSKJabatanKenaikanFungsional.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LayananViewer from "../../../../../feature/layanan/LayananViewer"; 
import {
  CheckCircle,
  Download,
  Phone,
  ArrowRight,
  Clock,
  FileText,
  Calendar,
  MapPin,
  Globe,
  RefreshCw,
  // --- IKON ADMIN STANDARD ---
  User,
  Settings,
  Database,
  Layout,
  MessageCircle,
  Mail,
  HelpCircle,
  // --- IKON KHUSUS KENAIKAN JABATAN ---
  TrendingUp,       // Ikon Utama (Kenaikan Jenjang)
  Briefcase,        // Ikon Jabatan
  Award,            // Ikon Angka Kredit
  UploadCloud,      // Ikon Upload Berkas/DUPAK
  FileCheck,        // Ikon Verifikasi/Validasi
  ClipboardCheck,   // Ikon Uji Kompetensi
  CalendarRange     // Ikon Periode Penilaian
} from "lucide-react";

// --- TIPE DATA (Sesuai Struktur Admin) ---
interface ContentData {
  layanan: string;
  
  // Toggles
  isPersyaratanActive: boolean;
  isAlurActive: boolean;

  // Tab Settings
  tabTitle?: string;
  tabIcon?: string;

  // Preview Settings
  previewSectionTitle?: string;
  previewSectionDesc?: string;

  // Portal Settings
  portalVisible?: boolean;
  portalUrl?: string;
  portalLabel?: string;

  // Download Settings
  downloadSectionTitle?: string;
  downloadSectionDesc?: string;

  // Contact Settings
  contactSectionTitle?: string;
  contactSectionDesc?: string;
  contactSectionIcon?: string;

  // Arrays / Lists
  persyaratan: string[];
  alur: { 
    step: number; 
    title: string; 
    desc: string; 
    color?: string; 
  }[];
  downloads: { name: string; url: string }[];
  jamOperasional: { 
    day: string; 
    time: string; 
    status?: string;
    breakTime?: string; 
  }[];
  contacts?: { name: string; number: string }[];
  mapLink: string;
}

// --- KOMPONEN LOADER OVERLAY (Tema Indigo/Purple) ---
const UpdatingOverlay = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center"
  >
    <div className="relative">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-blue-500 border-l-transparent"
      />
      <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
        <RefreshCw size={24} className="animate-spin-slow" />
      </div>
    </div>
    <motion.p 
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mt-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-sm tracking-wider uppercase"
    >
      Sinkronisasi Data Jabatan...
    </motion.p>
  </motion.div>
);

export default function LayananSKJabatanKenaikanFungsional() {
  const [activeTab, setActiveTab] = useState<"service" | "schedule">("service");
  
  // State Data
  const [content, setContent] = useState<ContentData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevContentRef = useRef<string>("");

  // --- LOGIKA FETCHING (Polling) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ENDPOINT: SK Kenaikan Jabatan Fungsional
        const response = await fetch("http://localhost:8000/api/kepegawaian/content/sk-jabatan-kenaikan-fungsional");
        
        if (response.ok) {
          const rawData = await response.json();
          const stringifiedData = JSON.stringify(rawData);

          if (prevContentRef.current !== stringifiedData) {
            if (!initialLoading) {
              setIsUpdating(true);
              await new Promise(r => setTimeout(r, 800));
            }
            setContent(rawData);
            prevContentRef.current = stringifiedData;
            setIsUpdating(false);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data jabatan fungsional", error);
      } finally {
        if (initialLoading) setInitialLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 3000); 
    return () => clearInterval(intervalId);
  }, [initialLoading]); 

  // --- VIEWER PROPS ---
  const viewerProps = {
    endpoint: "http://localhost:8000/api/kepegawaian/upload/sk-jabatan-kenaikan-fungsional", 
  };

  // --- HELPER: COLOR MAPPING (Indigo Theme) ---
  const getStepColor = (color: string | undefined) => {
    switch(color) {
      case 'blue': return 'bg-blue-100 text-blue-600 border-blue-200 ring-blue-500';
      case 'emerald': return 'bg-emerald-100 text-emerald-600 border-emerald-200 ring-emerald-500';
      case 'purple': return 'bg-purple-100 text-purple-600 border-purple-200 ring-purple-500';
      case 'amber': return 'bg-amber-100 text-amber-600 border-amber-200 ring-amber-500';
      case 'rose': return 'bg-rose-100 text-rose-600 border-rose-200 ring-rose-500';
      case 'indigo': return 'bg-indigo-100 text-indigo-600 border-indigo-200 ring-indigo-500';
      default: return 'bg-indigo-100 text-indigo-600 border-indigo-200 ring-indigo-500';
    }
  };

  const getDayStatusBadge = (status: string | undefined) => {
    switch(status) {
        case 'off': return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-600">Tutup</span>;
        case 'special': return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-600">Uji Kom</span>;
        default: return null; 
    }
  };

  // --- HELPER: ICON MAPPING ---
  const getIconComponent = (iconName: string | undefined, defaultIcon: any) => {
    switch (iconName) {
        // --- Admin Tab Options ---
        case "FileText": return FileText;
        case "Briefcase": return Briefcase;
        case "Award": return Award;
        case "User": return User;
        case "Settings": return Settings;
        case "Database": return Database;
        case "Layout": return Layout;

        // --- Admin Contact Options ---
        case "Phone": return Phone;
        case "MessageCircle": return MessageCircle;
        case "Mail": return Mail;
        case "HelpCircle": return HelpCircle;

        // --- Kenaikan Jabatan Specific ---
        case "TrendingUp": return TrendingUp;
        case "UploadCloud": return UploadCloud;
        case "FileCheck": return FileCheck;
        case "ClipboardCheck": return ClipboardCheck;
        case "CalendarRange": return CalendarRange;
        
        default: return defaultIcon; 
    }
  };

  // --- INITIAL LOADING ---
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold text-xs">JAFUNG</div>
            </div>
            <p className="text-slate-500 font-medium animate-pulse">Memuat data kenaikan jabatan...</p>
        </div>
      </div>
    );
  }

  // --- FALLBACK DATA ---
  const data: ContentData = content || {
    layanan: "sk-jabatan-fungsional", 
    isPersyaratanActive: true,
    isAlurActive: true,
    persyaratan: [],
    alur: [],
    downloads: [],
    jamOperasional: [],
    mapLink: "#",
    tabTitle: "Syarat & Prosedur", 
    tabIcon: "TrendingUp",
    portalVisible: false,
    downloadSectionTitle: "Dokumen Administrasi",
    contactSectionTitle: "Subbidang PTK",
    contactSectionIcon: "Phone"
  };

  // Resolve Icons
  const TabIconComponent = getIconComponent(data.tabIcon, TrendingUp);
  const ContactIconComponent = getIconComponent(data.contactSectionIcon, Phone);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ================= HERO SECTION (Theme: Indigo/Dark Blue) ================= */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-40 pb-48 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

          <div className="relative container mx-auto max-w-5xl text-center z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-2 text-sm text-indigo-300 font-medium tracking-widest uppercase mb-6"
            >
              <Link to="/" className="hover:text-white transition-colors duration-300">Beranda</Link>
              <span className="text-slate-500">•</span>
              <Link to="/kepegawaian" className="text-blue-400 hover:text-white transition-colors duration-300">
                Kepegawaian
              </Link>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Layanan Kenaikan <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Jabatan Fungsional
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Fasilitasi penerbitan SK kenaikan jenjang jabatan fungsional melalui penilaian angka kredit dan uji kompetensi.
            </motion.p>

             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "6rem" }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"
             ></motion.div>
          </div>
        </div>
      </div>

      {/* ================= KONTEN UTAMA ================= */}
      <div className="relative z-30 -mt-32 pb-24 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* === KOLOM KIRI (Viewer & Info) === */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:w-2/3 order-2 lg:order-1 relative"
            >
              {/* Overlay Update */}
              <AnimatePresence>
                {isUpdating && <UpdatingOverlay />}
              </AnimatePresence>
              
              <motion.div 
                layout
                transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col h-fit"
              >
                {/* Header Line Color - Blue/Indigo/Purple */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 z-10"></div>

                {/* --- TABS --- */}
                <div className="flex border-b border-slate-100 bg-slate-50/50 pt-4 px-4 md:px-8 gap-6 overflow-x-auto scrollbar-hide z-0">
                  <button 
                    onClick={() => setActiveTab("service")}
                    className={`pb-4 px-2 font-bold text-sm md:text-base flex items-center gap-2 transition-all relative ${
                      activeTab === "service" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <TabIconComponent size={20} />
                    {data.tabTitle || "Syarat & Prosedur"}
                    {activeTab === "service" && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
                    )}
                  </button>

                  <button 
                    onClick={() => setActiveTab("schedule")}
                    className={`pb-4 px-2 font-bold text-sm md:text-base flex items-center gap-2 transition-all relative ${
                      activeTab === "schedule" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <CalendarRange size={20} />
                    Jadwal Uji Kom
                    {activeTab === "schedule" && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
                    )}
                  </button>
                </div>

                {/* --- TAB CONTENT --- */}
                <div className="p-6 md:p-8 flex-1 bg-white relative">
                  <AnimatePresence mode="wait">
                    
                    {/* === TAB 1: REGULASI & ALUR === */}
                    {activeTab === "service" && (
                      <motion.div
                        key="service"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-10"
                      >
                        {/* 1. PDF VIEWER */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                    <FileCheck size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {data.previewSectionTitle || "Pratinjau Regulasi"}
                                    </h3>
                                    {data.previewSectionDesc && (
                                        <p className="text-sm text-slate-500">{data.previewSectionDesc}</p>
                                    )}
                                </div>
                            </div>

                            <div className="w-full h-[500px] bg-slate-50 rounded-2xl border border-slate-200 shadow-inner relative isolate overflow-hidden overscroll-contain transform-gpu z-0">
                                <LayananViewer
                                    judul="" 
                                    deskripsi=""
                                    endpoint={viewerProps.endpoint} 
                                />
                            </div>
                        </div>

                        {/* 2. SYARAT & ALUR */}
                        {(data.isPersyaratanActive || data.isAlurActive) && (
                          <motion.div 
                            layout 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-10"
                          >
                            <div className="border-t border-slate-100"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* SYARAT (Context: Kelengkapan DUPAK & Uji Kom) */}
                                {data.isPersyaratanActive && (
                                  <div className="space-y-5">
                                      <div className="flex items-center gap-2 mb-2">
                                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                              <CheckCircle className="text-indigo-500" size={20}/>
                                              Syarat Pengajuan
                                          </h3>
                                      </div>
                                      <ul className="space-y-3">
                                          {data.persyaratan.length > 0 ? (
                                            data.persyaratan.map((req, index) => (
                                              req && (
                                                <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></div>
                                                    <span className="text-slate-600 text-sm font-medium leading-relaxed">{req}</span>
                                                </li>
                                              )
                                            ))
                                          ) : (
                                            <p className="text-sm text-slate-400 italic">Belum ada data persyaratan.</p>
                                          )}
                                      </ul>
                                  </div>
                                )}

                                {/* ALUR (Context: Proses Penilaian & Penerbitan) */}
                                {data.isAlurActive && (
                                  <div className="space-y-5">
                                      <div className="flex items-center gap-2 mb-2">
                                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                              <TrendingUp className="text-indigo-500" size={20}/>
                                              Mekanisme Kenaikan
                                          </h3>
                                      </div>
                                      <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                                          {data.alur.length > 0 ? (
                                            data.alur.map((step, idx) => (
                                              <div key={idx} className="relative">
                                                  <div className={`absolute -left-[29px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-4 border-white ${getStepColor(step.color).replace(/ring-\w+-\d+/g, '').replace(/border-\w+-\d+/g, '').split(' ')[0]} ${getStepColor(step.color).match(/ring-\w+-\d+/)}`}>
                                                      {step.step}
                                                  </div>
                                                  <h4 className="font-bold text-slate-700 text-sm">{step.title}</h4>
                                                  <p className="text-slate-400 text-xs mt-1">{step.desc}</p>
                                              </div>
                                            ))
                                          ) : (
                                            <p className="text-sm text-slate-400 italic">Belum ada data alur.</p>
                                          )}
                                      </div>
                                  </div>
                                )}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* === TAB 2: JADWAL PERIODE === */}
                    {activeTab === "schedule" && (
                        <motion.div
                        key="schedule"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Jadwal Periode Penilaian</h3>
                                <p className="text-sm text-slate-400">Jadwal sidang penetapan angka kredit dan penerbitan SK.</p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {data.jamOperasional.length > 0 ? (
                              data.jamOperasional.map((item, idx) => (
                                <div key={idx} className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group ${item.status === 'off' ? 'bg-rose-50/50 border-rose-100' : 'bg-white border-slate-100 hover:border-indigo-100'}`}>
                                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                                        <div className={`p-3 rounded-xl ${item.status === 'off' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className={`font-bold text-lg ${item.status === 'off' ? 'text-rose-800' : 'text-slate-800'}`}>{item.day}</h4>
                                                {getDayStatusBadge(item.status)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-1 pl-14 md:pl-0">
                                        {item.status !== 'off' ? (
                                            <>
                                                <div className="flex items-center gap-2 text-slate-700 font-bold">
                                                    <Clock size={16} className="text-slate-400"/>
                                                    {item.time}
                                                </div>
                                                {item.breakTime && item.breakTime !== '-' && (
                                                    <div className="text-sm text-slate-400 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                                                        Ket: {item.breakTime}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-rose-500 font-medium text-sm italic flex items-center gap-2">
                                                Tutup
                                            </div>
                                        )}
                                    </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-slate-400 italic py-10">Jadwal belum diatur.</p>
                            )}
                        </div>

                          {data.mapLink && (
                           <a href={data.mapLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 font-medium cursor-pointer hover:underline mt-2">
                              <MapPin size={16} /> Lihat Lokasi Kantor Dinas
                           </a>
                          )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>

            {/* === KOLOM KANAN (Sidebar) === */}
            <motion.div 
               layout 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.5 }}
               className="lg:w-1/3 flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-8 h-fit z-30 relative"
            >
              <AnimatePresence>
                {isUpdating && <UpdatingOverlay />}
              </AnimatePresence>

              {/* 1. BUTTON PORTAL SIASN/DISPAK */}
              <AnimatePresence mode="popLayout">
                {data.portalVisible && (
                    <motion.div
                        key="portal-button"
                        layout 
                        initial={{ opacity: 0, scale: 0.9, height: 0 }}
                        animate={{ opacity: 1, scale: 1, height: "auto" }}
                        exit={{ opacity: 0, scale: 0.9, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <a
                        href={data.portalUrl || "#"} 
                        target="_blank"
                        rel="noreferrer"
                        className="group w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-center text-lg shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <Globe className="relative z-10" size={20}/>
                        <span className="relative z-10">{data.portalLabel || "Akses SIASN / DISPAK"}</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" size={20} />
                      </a>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* 2. DOWNLOAD AREA (DUPAK/Format) */}
              <motion.div 
                layout 
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                <div className="mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Download size={20} />
                        </div>
                        {data.downloadSectionTitle || "Unduh Dokumen"}
                    </h3>
                    {data.downloadSectionDesc && (
                      <p className="text-sm text-slate-500 leading-relaxed">
                          {data.downloadSectionDesc}
                      </p>
                    )}
                </div>

                <div className="space-y-4">
                  {data.downloads.length > 0 ? (
                    data.downloads.map((file, index) => (
                      <a key={index} href={file.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="w-10 h-10 bg-white text-rose-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                            <FileText size={20} />
                          </div>
                          <span className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-700 transition">
                            {file.name}
                          </span>
                        </div>
                        <Download size={18} className="text-slate-400 group-hover:text-indigo-600 shrink-0 transition" />
                      </a>
                    ))
                  ) : (
                      <div className="py-6 text-center px-4">
                        <p className="text-sm text-slate-500 italic font-medium">
                            Belum ada template dokumen yang tersedia.
                        </p>
                      </div>
                  )}
                </div>
              </motion.div>

              {/* 3. CONTACT CARD (Subbidang PTK) */}
              <motion.div 
                layout 
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-[#0f172a] text-white rounded-3xl shadow-xl p-8 relative overflow-hidden group"
              >
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:bg-indigo-500/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -translate-x-10 translate-y-10"></div>
                
                <div className="relative z-10 mb-8">
                    <h3 className="font-bold mb-4 flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <ContactIconComponent className="text-yellow-400" size={20} />
                        </div>
                        {data.contactSectionTitle || "Subbidang PTK"}
                    </h3>
                    {data.contactSectionDesc && (
                      <p className="text-sm text-slate-400 leading-relaxed">
                          {data.contactSectionDesc}
                      </p>
                    )}
                </div>

                <div className="relative z-10 space-y-3">
                  {data.contacts && data.contacts.length > 0 ? (
                      data.contacts.map((contact, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors backdrop-blur-md">
                            <div className="bg-yellow-400 p-2.5 rounded-full text-slate-900 shadow-lg shadow-yellow-400/20">
                              <ContactIconComponent size={18} />
                            </div>
                            <div>
                            <p className="text-[10px] text-yellow-200 uppercase font-bold tracking-wider mb-0.5">
                                {contact.name || "Verifikator"}
                            </p>
                            <p className="font-bold text-lg tracking-wide">
                                {contact.number}
                            </p>
                            </div>
                        </div>
                      ))
                  ) : (
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center italic text-slate-500 text-sm">
                        Belum ada kontak tersedia.
                      </div>
                  )}
                </div>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}