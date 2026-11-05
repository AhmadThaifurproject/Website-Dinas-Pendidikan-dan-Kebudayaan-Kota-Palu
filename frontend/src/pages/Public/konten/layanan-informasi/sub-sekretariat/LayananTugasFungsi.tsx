// src/pages/Public/LayananTugasFungsi/LayananTugasFungsi.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LayananViewer from "../../../../../feature/layanan/LayananViewer"; 
import {
  FileText,       // Icon Utama
  Scale,          // Untuk Dasar Hukum
  Users,          // Untuk Struktur Organisasi/Jabatan
  Building2,      // Icon Gedung/Instansi
  Briefcase,      // Icon Pekerjaan
  Download,
  Phone,
  ArrowRight,
  MapPin,
  Globe,
  Layout,
  RefreshCw,
  CheckCircle2,
  ListChecks,
  Network,        // Untuk Struktur/Hierarki
  MessageCircle,
  Mail,
  HelpCircle,
  Clock,
  Calendar
} from "lucide-react";

// --- KONFIGURASI API (DINAMIS) ---
// ✅ MENGGUNAKAN VARIABLE ENV VITE (Sesuai Referensi BOS)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- TIPE DATA DARI BACKEND (Sesuai FormInputDataSubSekretariat.tsx) ---
interface ContentData {
  layanan: string;
  
  // Feature Flags
  isDasarHukumActive: boolean;    
  isStrukturActive: boolean;      
  
  // Data Arrays
  dasarHukum?: string[];          
  strukturOrganisasi?: { 
    level: number; 
    position: string; 
    role: string; 
    color?: string; 
  }[];
  
  downloads?: { name: string; url: string }[];
  
  // Mapping dari uraianTugas (Admin: jamOperasional)
  uraianTugas?: { 
    jabatan: string; 
    summary: string; 
    details?: string[]; // Array of strings (poin tugas)
    status?: string;
  }[];
  
  mapLink: string;
  
  // UI Settings (Dynamic Content)
  previewSectionTitle?: string;
  previewSectionDesc?: string;
  
  tabTitle?: string;
  tabIcon?: string;
  portalVisible?: boolean;
  portalUrl?: string;
  portalLabel?: string;
  downloadSectionTitle?: string;
  downloadSectionDesc?: string;
  contactSectionTitle?: string;
  contactSectionDesc?: string;
  contactSectionIcon?: string;
  contacts?: { name: string; number: string }[];
}

// --- KOMPONEN LOADER ---
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
      Menyinkronkan Data SOTK...
    </motion.p>
  </motion.div>
);

export default function LayananTugasFungsi() {
  const [activeTab, setActiveTab] = useState<"tupoksi" | "rincian">("tupoksi");
  
  // State Data
  const [content, setContent] = useState<ContentData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const prevContentRef = useRef<string>("");

  // --- LOGIKA FETCHING (POLLING SAMA SEPERTI REFERENSI) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ URL Sesuai Struktur Admin & Referensi BOS
        // Pastikan route backend: /api/public/sub-sekretariat/content/tugas-fungsi
        const response = await fetch(`${API_BASE_URL}/public/sub-sekretariat/content/tugas-fungsi`);
        
        if (response.ok) {
          const rawData = await response.json();
          const stringifiedData = JSON.stringify(rawData);

          if (prevContentRef.current !== stringifiedData) {
            if (!initialLoading) {
              setIsUpdating(true);
              await new Promise(r => setTimeout(r, 800)); // Delay halus
            }
            setContent(rawData);
            prevContentRef.current = stringifiedData; 
            setIsUpdating(false);
          }
        }
      } catch (error) {
        console.error("Error connecting to server", error);
      } finally {
        if (initialLoading) setInitialLoading(false);
      }
    };

    fetchData(); 
    // Polling setiap 3 detik
    const intervalId = setInterval(fetchData, 3000); 
    return () => clearInterval(intervalId);
  }, [initialLoading]); 

  // --- HELPER FUNCTIONS ---
  const getLevelColor = (color: string | undefined) => {
    switch(color) {
      case 'blue': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'emerald': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'purple': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'amber': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'rose': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'indigo': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getIconComponent = (iconName: string | undefined, defaultIcon: any) => {
    switch (iconName) {
        case "Building2": return Building2;
        case "Scale": return Scale;
        case "Users": return Users;
        case "ListChecks": return ListChecks;
        case "Network": return Network;
        case "Briefcase": return Briefcase;
        case "Layout": return Layout;
        case "Phone": return Phone;
        case "FileText": return FileText;
        case "MessageCircle": return MessageCircle;
        case "Mail": return Mail;
        case "HelpCircle": return HelpCircle;
        default: return defaultIcon; 
    }
  };

  // --- RENDER INITIAL LOADING ---
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold text-xs">SOTK</div>
            </div>
            <p className="text-slate-500 font-medium animate-pulse">Memuat data tugas & fungsi...</p>
        </div>
      </div>
    );
  }

  // --- FALLBACK DATA ---
  const data: ContentData = content || {
    layanan: "tugas-fungsi", 
    isDasarHukumActive: false,
    isStrukturActive: false,
    dasarHukum: [],
    strukturOrganisasi: [],
    downloads: [],
    uraianTugas: [], 
    mapLink: "#",
    previewSectionTitle: "Dokumen SOTK",
    previewSectionDesc: "Pratinjau SK/Peraturan mengenai Struktur Organisasi dan Tata Kerja.",
    tabTitle: "Regulasi & Struktur", 
    tabIcon: "FileText",
    portalVisible: true,
    portalUrl: "#",
    portalLabel: "Akses E-Kinerja / Anjab",
    downloadSectionTitle: "Unduh Dokumen",
    downloadSectionDesc: "Dapatkan salinan Peta Jabatan dan Dokumen SOTK.",
    contactSectionTitle: "Kontak Sekretariat",
    contactSectionDesc: "Hubungi admin untuk informasi kelembagaan.",
    contactSectionIcon: "Phone",
    contacts: []
  };

  const TabIconMain = getIconComponent(data.tabIcon, FileText);
  const ContactIcon = getIconComponent(data.contactSectionIcon, Phone);

  // VIEWER PROPS
  const viewerProps = {
    judul: data.previewSectionTitle || "Dokumen SOTK",
    deskripsi: data.previewSectionDesc || "Pratinjau dokumen tugas dan fungsi.",
    endpoint: `${API_BASE_URL}/public/sub_sekretariat/upload/tugas-fungsi`, 
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ================= HERO SECTION (VISUAL WARNA SINKRON) ================= */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-40 pb-48 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
          {/* Gradient Warna Biru/Ungu seperti Referensi */}
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
              <Link to="/sub-sekretariat" className="text-blue-400 hover:text-white transition-colors duration-300">Sub Sekretariat</Link>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Layanan <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Tugas & Fungsi
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Landasan hukum, struktur organisasi, dan uraian tugas dalam mendukung operasional dinas.
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
              <AnimatePresence>
                {isUpdating && <UpdatingOverlay />}
              </AnimatePresence>
              
              <motion.div 
                layout
                transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 15 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden flex flex-col h-fit"
              >
                {/* Header Line (Sesuai Referensi) */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 z-10"></div>

                {/* --- NAVIGATION TABS --- */}
                <div className="flex border-b border-slate-100 bg-slate-50/50 pt-4 px-4 md:px-8 gap-6 overflow-x-auto scrollbar-hide z-0">
                  <button 
                    onClick={() => setActiveTab("tupoksi")}
                    className={`pb-4 px-2 font-bold text-sm md:text-base flex items-center gap-2 transition-all relative ${
                      activeTab === "tupoksi" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <TabIconMain size={20} />
                    {data.tabTitle}
                    {activeTab === "tupoksi" && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
                    )}
                  </button>

                  <button 
                    onClick={() => setActiveTab("rincian")}
                    className={`pb-4 px-2 font-bold text-sm md:text-base flex items-center gap-2 transition-all relative ${
                      activeTab === "rincian" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <ListChecks size={20} />
                    Uraian Tugas
                    {activeTab === "rincian" && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
                    )}
                  </button>
                </div>

                {/* --- TAB CONTENT AREA --- */}
                <div className="p-6 md:p-8 flex-1 bg-white relative">
                  <AnimatePresence mode="wait">
                    
                    {/* TAB 1: DOKUMEN & STRUKTUR */}
                    {activeTab === "tupoksi" && (
                      <motion.div
                        key="tupoksi"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-10"
                      >
                        {/* 1. FILE PREVIEW */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                {/* Warna Icon (Purple/Indigo) */}
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{viewerProps.judul}</h3>
                                    <p className="text-sm text-slate-500">{viewerProps.deskripsi}</p>
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

                        {(data.isDasarHukumActive || data.isStrukturActive) && (
                          <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                            <div className="border-t border-slate-100"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Dasar Hukum */}
                                {data.isDasarHukumActive && (
                                  <div className="space-y-5">
                                      <div className="flex items-center gap-2 mb-2">
                                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                              <Scale className="text-indigo-500" size={20}/>
                                              Dasar Hukum
                                          </h3>
                                      </div>
                                      <ul className="space-y-3">
                                          {(data.dasarHukum || []).length > 0 ? (
                                            (data.dasarHukum || []).map((hukum, index) => hukum && (
                                              <li key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                                                  <span className="text-slate-600 text-sm font-medium leading-relaxed">{hukum}</span>
                                              </li>
                                            ))
                                          ) : (
                                            <p className="text-sm text-slate-400 italic">Data dasar hukum belum tersedia.</p>
                                          )}
                                      </ul>
                                  </div>
                                )}

                                {/* Struktur Organisasi */}
                                {data.isStrukturActive && (
                                  <div className="space-y-5">
                                      <div className="flex items-center gap-2 mb-2">
                                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                              <Network className="text-blue-500" size={20}/>
                                              Hierarki Jabatan
                                          </h3>
                                      </div>
                                      <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                                          {(data.strukturOrganisasi || []).length > 0 ? (
                                            (data.strukturOrganisasi || []).map((item, idx) => (
                                              <div key={idx} className="relative group">
                                                  <div className={`absolute -left-[29px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-4 border-white ${getLevelColor(item.color)}`}>
                                                      <Users size={12} />
                                                  </div>
                                                  <h4 className="font-bold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{item.position}</h4>
                                                  <p className="text-slate-400 text-xs mt-1">{item.role}</p>
                                              </div>
                                            ))
                                          ) : (
                                            <p className="text-sm text-slate-400 italic">Struktur belum didefinisikan.</p>
                                          )}
                                      </div>
                                  </div>
                                )}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {/* TAB 2: URAIAN TUGAS */}
                    {activeTab === "rincian" && (
                        <motion.div
                        key="rincian"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                      >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <ListChecks size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Uraian Tugas Jabatan</h3>
                                <p className="text-sm text-slate-400">Rincian tugas pokok dan fungsi setiap jabatan struktural.</p>
                            </div>
                          </div>

                          <div className="grid gap-6">
                            {(data.uraianTugas || []).length > 0 ? (
                              (data.uraianTugas || []).map((tugas, idx) => (
                                <div key={idx} className="p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all bg-white group">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <Briefcase size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-800">{tugas.jabatan}</h4>
                                            <p className="text-sm text-slate-500 mt-1">{tugas.summary}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="pl-0 md:pl-[68px]">
                                        <ul className="space-y-2">
                                            {(tugas.details || []).map((detail, dIdx) => (
                                                <li key={dIdx} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <CheckCircle2 size={16} className="text-teal-500 mt-0.5 shrink-0" />
                                                    <span className="leading-relaxed">{detail}</span>
                                                </li>
                                            ))}
                                            {(!tugas.details || tugas.details.length === 0) && (
                                                <li className="text-xs text-slate-400 italic">Belum ada rincian poin tugas.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                  <Briefcase className="mx-auto text-slate-300 mb-2" size={32} />
                                  <p className="text-slate-400 italic">Belum ada rincian tugas.</p>
                              </div>
                            )}
                          </div>

                          {data.mapLink && (
                           <a href={data.mapLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 font-medium cursor-pointer hover:underline mt-2">
                              <MapPin size={16} /> Lihat Lokasi Kantor Utama
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

              {/* Portal Button */}
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
                        <span className="relative z-10">{data.portalLabel || "Akses Aplikasi"}</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform relative z-10" size={20} />
                      </a>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* Download Area */}
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
                        {data.downloadSectionTitle || "Unduh Dokumen"}
                    </h3>
                    {data.downloadSectionDesc && (
                      <p className="text-sm text-slate-500 leading-relaxed">
                          {data.downloadSectionDesc}
                      </p>
                    )}
                </div>

                <div className="space-y-4">
                  {(data.downloads || []).length > 0 ? (
                    (data.downloads || []).map((file, index) => (
                      <a key={index} href={file.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="w-10 h-10 bg-white text-blue-500 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
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
                            Belum ada dokumen yang tersedia.
                        </p>
                      </div>
                  )}
                </div>
              </motion.div>

              {/* Contact Card */}
              <motion.div 
                layout 
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-[#0f172a] text-white rounded-3xl shadow-xl p-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl translate-x-10 -translate-y-10 group-hover:bg-indigo-500/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-x-10 translate-y-10"></div>
                
                <div className="relative z-10 mb-8">
                    <h3 className="font-bold mb-4 flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <ContactIcon className="text-yellow-400" size={20} />
                        </div>
                        {data.contactSectionTitle || "Kontak Layanan"}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {data.contactSectionDesc || "Hubungi admin untuk informasi lebih lanjut."}
                    </p>
                </div>

                <div className="relative z-10 space-y-3">
                  {(data.contacts || []).length > 0 ? (
                      (data.contacts || []).map((contact, i) => (
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