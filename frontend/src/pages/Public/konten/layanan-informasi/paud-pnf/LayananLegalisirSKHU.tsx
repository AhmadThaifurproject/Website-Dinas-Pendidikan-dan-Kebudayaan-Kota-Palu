// src/pages/Public/LayananPAUD/LayananLegalisirSKHU.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LayananViewer from "../../../../../feature/layanan/LayananViewer.tsx"; 
import {
  CheckCircle,
  Download,
  Phone,
  ArrowRight,
  Clock,
  FileText,
  Briefcase,
  Calendar,
  MapPin,
  Globe,
  School,
  User,
  Settings,
  Database,
  Layout,
  RefreshCw,
  PenTool,
  ClipboardCheck
} from "lucide-react";

// --- KONFIGURASI API (DINAMIS) ---
// ✅ MENGGUNAKAN VARIABLE ENV VITE
const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- TIPE DATA DARI BACKEND (Standar Konsisten) ---
interface ContentData {
  layanan: string;
  isPersyaratanActive: boolean;
  isAlurActive: boolean;
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
  mapLink: string;
  tabTitle?: string;
  tabIcon?: string;
  portalVisible?: boolean;
  portalUrl?: string;
  portalLabel?: string;
  downloadSectionTitle?: string;
  downloadSectionDesc?: string;
  contactSectionTitle?: string;
  contactSectionDesc?: string;
  contacts?: { name: string; number: string }[];
}

// --- KOMPONEN ELEGANT LOADER OVERLAY ---
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
        className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-transparent"
      />
      <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
        <RefreshCw size={24} className="animate-spin-slow" />
      </div>
    </div>
    <motion.p 
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mt-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-sm tracking-wider uppercase"
    >
      Menyinkronkan Data...
    </motion.p>
  </motion.div>
);

export default function LayananLegalisirSKHU() {
  const [activeTab, setActiveTab] = useState<"service" | "schedule">("service");
  
  // State Data
  const [content, setContent] = useState<ContentData | null>(null);
  
  // State Loading Awal (Full Screen)
  const [initialLoading, setInitialLoading] = useState(true);
  
  // State Updating (Overlay saat polling)
  const [isUpdating, setIsUpdating] = useState(false);

  // Ref untuk menyimpan data terakhir agar bisa dibandingkan
  const prevContentRef = useRef<string>("");

  // --- LOGIKA FETCHING (POLLING) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ GUNAKAN API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/public/paud/content/legalisir-skhu`);
        
        if (response.ok) {
          const rawData = await response.json();
          const stringifiedData = JSON.stringify(rawData);

          // Cek apakah data BERBEDA dari sebelumnya?
          if (prevContentRef.current !== stringifiedData) {
            
            // Jika ini bukan load pertama, nyalakan efek "Updating"
            if (!initialLoading) {
              setIsUpdating(true);
              await new Promise(r => setTimeout(r, 800)); // Delay estetika
            }

            setContent(rawData);
            prevContentRef.current = stringifiedData; // Update referensi data
            
            setIsUpdating(false);
          }
        }
      } catch (error) {
        console.error("Error connecting to server", error);
      } finally {
        // Matikan loading awal hanya sekali
        if (initialLoading) setInitialLoading(false);
      }
    };

    fetchData(); // Load pertama langsung
    
    // Polling setiap 3 detik (3000ms)
    const intervalId = setInterval(fetchData, 3000); 
    
    // Cleanup saat komponen di-unmount
    return () => clearInterval(intervalId);
  }, [initialLoading]); 

  // --- VIEWER PROPS ---
  // ✅ GUNAKAN API_BASE_URL
  const viewerProps = {
    judul: "Contoh Dokumen SKHU",
    deskripsi: "Contoh format dokumen SKHU yang dapat dilegalisir.",
    endpoint: `${API_BASE_URL}/public/paud/upload/legalisir-skhu`, 
  };

  // --- HELPER FUNCTIONS ---
  const getStepColor = (color: string | undefined) => {
    switch(color) {
      case 'blue': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'emerald': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'purple': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'amber': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'rose': return 'bg-rose-100 text-rose-600 border-rose-200';
      default: return 'bg-blue-100 text-blue-600 border-blue-200';
    }
  };

  const getDayStatusBadge = (status: string | undefined) => {
    switch(status) {
        case 'off': return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-600">Tutup</span>;
        case 'special': return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-600">Khusus</span>;
        default: return null; 
    }
  };

  const getTabIconComponent = (iconName: string | undefined) => {
    switch (iconName) {
        case "School": return School;
        case "User": return User;
        case "Settings": return Settings;
        case "Database": return Database;
        case "Layout": return Layout;
        case "PenTool": return PenTool;
        case "ClipboardCheck": return ClipboardCheck;
        case "FileText": default: return FileText; 
    }
  };

  // --- RENDER INITIAL LOADING (Full Screen) ---
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-bold text-xs">PAUD</div>
            </div>
            <p className="text-slate-500 font-medium animate-pulse">Memuat data legalisir...</p>
        </div>
      </div>
    );
  }

  // --- FALLBACK DATA ---
  const data: ContentData = content || {
    layanan: "legalisir-skhu", 
    isPersyaratanActive: false,
    isAlurActive: false,
    persyaratan: [],
    alur: [],
    downloads: [],
    jamOperasional: [],
    mapLink: "#",
    tabTitle: "Prosedur & Syarat", 
    tabIcon: "PenTool",
    portalVisible: false,
    portalUrl: "",
    portalLabel: "Cek Status Legalisir",
    downloadSectionTitle: "Formulir Permohonan",
    downloadSectionDesc: "Unduh formulir permohonan legalisir.",
    contactSectionTitle: "Layanan Pelanggan",
    contactSectionDesc: "Hubungi kami jika ada pertanyaan terkait legalisir.",
    contacts: []
  };

  const TabIconService = getTabIconComponent(data.tabIcon);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-40 pb-48 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          {/* Background effects... */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
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
              <Link to="/paud" className="text-blue-400 hover:text-white transition-colors duration-300">
                Layanan PAUD
              </Link>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Legalisir SKHU <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Paket A, B, dan C
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Proses verifikasi dan legalisasi Surat Keterangan Hasil Ujian Paket Kesetaraan.
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
            
            {/* === KOLOM KIRI (Konten Utama) === */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:w-2/3 order-2 lg:order-1 relative"
            >
              {/* === OVERLAY UPDATE ANIMATION === */}
              <AnimatePresence>
                {isUpdating && <UpdatingOverlay />}
              </AnimatePresence>
              
              {/* CONTAINER UTAMA */}
              <motion.div 
                layout
                transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col h-fit"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 z-10"></div>

                {/* --- NAVIGATION TABS --- */}
                <div className="flex border-b border-slate-100 bg-slate-50/50 pt-4 px-4 md:px-8 gap-6 overflow-x-auto scrollbar-hide z-0">
                  <button 
                    onClick={() => setActiveTab("service")}
                    className={`pb-4 px-2 font-bold text-sm md:text-base flex items-center gap-2 transition-all relative ${
                      activeTab === "service" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <TabIconService size={20} />
                    {data.tabTitle || "Prosedur & Syarat"}
                    {activeTab === "service" && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                    )}
                  </button>

                  <button 
                    onClick={() => setActiveTab("schedule")}
                    className={`pb-4 px-2 font-bold text-sm md:text-base flex items-center gap-2 transition-all relative ${
                      activeTab === "schedule" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Clock size={20} />
                    Jam Operasional
                    {activeTab === "schedule" && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                    )}
                  </button>
                </div>

                {/* --- TAB CONTENT AREA --- */}
                <div className="p-6 md:p-8 flex-1 bg-white relative">
                  <AnimatePresence mode="wait">
                    
                    {/* === TAB 1: LAYANAN & BERKAS === */}
                    {activeTab === "service" && (
                      <motion.div
                        key="service"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-10"
                      >
                        {/* 1. FILE PREVIEW UTAMA */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Pratinjau Dokumen</h3>
                                </div>
                            </div>

                            {/* CONTAINER PREVIEWER */}
                            <div className="w-full h-[500px] bg-slate-50 rounded-2xl border border-slate-200 shadow-inner relative isolate overflow-hidden overscroll-contain transform-gpu z-0">
                                <LayananViewer
                                    judul={viewerProps.judul} 
                                    deskripsi={viewerProps.deskripsi}
                                    endpoint={viewerProps.endpoint} 
                                />
                            </div>
                        </div>

                        {/* BAGIAN BAWAH */}
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
                                {/* 2. PERSYARATAN */}
                                {data.isPersyaratanActive && (
                                  <div className="space-y-5">
                                      <div className="flex items-center gap-2 mb-2">
                                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                              <CheckCircle className="text-blue-500" size={20}/>
                                              Persyaratan Berkas
                                          </h3>
                                      </div>
                                      <ul className="space-y-3">
                                          {data.persyaratan.length > 0 ? (
                                            data.persyaratan.map((req, index) => (
                                              req && (
                                                <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div>
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

                                {/* 3. ALUR */}
                                {data.isAlurActive && (
                                  <div className="space-y-5">
                                      <div className="flex items-center gap-2 mb-2">
                                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                              <Briefcase className="text-indigo-500" size={20}/>
                                              Alur Pelayanan
                                          </h3>
                                      </div>
                                      <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                                          {data.alur.length > 0 ? (
                                            data.alur.map((step, idx) => (
                                              <div key={idx} className="relative">
                                                  <div className={`absolute -left-[29px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-4 border-white ${getStepColor(step.color).replace('border-','ring-')}`}>
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

                    {/* === TAB 2: JAM OPERASIONAL === */}
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
                                <h3 className="text-xl font-bold text-slate-800">Jadwal Pelayanan</h3>
                                <p className="text-sm text-slate-400">Informasi hari dan jam buka layanan legalisir.</p>
                            </div>
                          </div>

                          {/* Jadwal Card Container */}
                          <div className="grid gap-4">
                            {data.jamOperasional.length > 0 ? (
                              data.jamOperasional.map((item, idx) => (
                                <div key={idx} className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group ${item.status === 'off' ? 'bg-rose-50/50 border-rose-100' : 'bg-white border-slate-100 hover:border-blue-100'}`}>
                                    {/* Hari */}
                                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                                        <div className={`p-3 rounded-xl ${item.status === 'off' ? 'bg-rose-100 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className={`font-bold text-lg ${item.status === 'off' ? 'text-rose-800' : 'text-slate-800'}`}>{item.day}</h4>
                                                {getDayStatusBadge(item.status)}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Jam */}
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
                                                        Istirahat: {item.breakTime}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-rose-500 font-medium text-sm italic flex items-center gap-2">
                                                Tidak ada pelayanan
                                            </div>
                                        )}
                                    </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-slate-400 italic py-10">Jadwal belum diatur.</p>
                            )}
                          </div>

                          {/* Link Peta */}
                          {data.mapLink && (
                           <a href={data.mapLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 font-medium cursor-pointer hover:underline mt-2">
                              <MapPin size={16} /> Lihat Lokasi Kantor di Google Maps
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
              {/* === OVERLAY UPDATE ANIMATION === */}
              <AnimatePresence>
                {isUpdating && <UpdatingOverlay />}
              </AnimatePresence>

              {/* 2. CTA BUTTON (Portal) */}
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
                        className="group w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-center text-lg shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <Globe className="relative z-10" size={20}/>
                        <span className="relative z-10">{data.portalLabel || "Cek Status Legalisir"}</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" size={20} />
                      </a>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* 3. DOWNLOAD AREA */}
              <motion.div 
                layout 
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                <div className="mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Download size={20} />
                        </div>
                        {data.downloadSectionTitle || "Area Download"}
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
                            Belum ada dokumen yang tersedia untuk diunduh saat ini.
                        </p>
                      </div>
                  )}
                </div>
              </motion.div>

              {/* 4. CONTACT CARD */}
              <motion.div 
                layout 
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-[#0f172a] text-white rounded-3xl shadow-xl p-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:bg-blue-500/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -translate-x-10 translate-y-10"></div>
                
                <div className="relative z-10 mb-8">
                    <h3 className="font-bold mb-4 flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Phone className="text-yellow-400" size={20} />
                        </div>
                        {data.contactSectionTitle || "Layanan Pelanggan"}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {data.contactSectionDesc || "Hubungi kami jika ada pertanyaan terkait legalisir."}
                    </p>
                </div>

                <div className="relative z-10 space-y-3">
                  {data.contacts && data.contacts.length > 0 ? (
                      data.contacts.map((contact, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors backdrop-blur-md">
                            <div className="bg-yellow-400 p-2.5 rounded-full text-slate-900 shadow-lg shadow-yellow-400/20">
                            <Phone size={18} />
                            </div>
                            <div>
                            <p className="text-[10px] text-yellow-200 uppercase font-bold tracking-wider mb-0.5">
                                {contact.name || "Admin"}
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