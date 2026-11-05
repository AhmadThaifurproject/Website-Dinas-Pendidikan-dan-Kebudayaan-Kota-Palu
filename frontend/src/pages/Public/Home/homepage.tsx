import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  ImageIcon, Globe, ChevronLeft, ChevronRight, 
  Calendar, ExternalLink, Sparkles, Newspaper, 
  Clock, Layers, CalendarDays, Megaphone, ArrowRight,
  Zap, Star
} from 'lucide-react';

// --- KONFIGURASI API (DINAMIS) ---
const API_BASE_URL = import.meta.env.VITE_API_URL;

// --- TIPE DATA ---
interface MediaMeta {
  type: "image" | "video" | "external_video" | "link";
  provider?: string;
  previewUrl?: string; 
  caption?: string;    
  streamUrl?: string;  
}

interface AgendaItem {
  id: string;
  type: "main" | "grid";
  title: string;
  description: string;
  dateLocation?: string;
  mediaUrl: string;
  targetUrl: string;
  buttonText: string;
  mediaMeta?: MediaMeta;
  captionSource: "auto" | "manual";
}

interface NewsItem {
  id: number;
  slug: string;
  judul: string;
  excerpt: string;
  thumbnail: string;
  gambar_url?: string | null;
  kategori?: string;
  highlight: boolean | number;
  published_at: string;
  description?: string;
  views?: number;
}

// --- KOMPONEN HELPER MEDIA ---
const MediaContent = ({ item, className }: { item: AgendaItem; className?: string }) => {
  const meta = item.mediaMeta;
  const url = item.mediaUrl;

  if (!url) {
    return (
      <div className={`w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 ${className}`}>
        <ImageIcon className="w-8 h-8 mb-2 opacity-30" />
        <span className="text-[10px] font-bold tracking-widest opacity-40 uppercase">No Media</span>
      </div>
    );
  }

  if (meta?.type === 'video') {
    return (
      <div className={`relative w-full h-full bg-black overflow-hidden flex items-center justify-center ${className}`}>
        <video 
          src={meta.streamUrl || url} 
          className="absolute inset-0 w-full h-full object-cover opacity-40 blur-lg scale-110" 
          muted loop 
        />
        <video 
          src={meta.streamUrl || url} 
          className="relative z-10 w-full h-full object-contain" 
          muted autoPlay loop playsInline 
        />
      </div>
    );
  }

  if (meta?.previewUrl || meta?.type === 'image' || (meta?.type === 'external_video' && meta.provider === 'YouTube')) {
    const imgSrc = meta?.previewUrl || url;
    return (
      <div className={`relative w-full h-full bg-black flex items-center justify-center group ${className} overflow-hidden`}>
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-50 blur-xl scale-125 transition-transform duration-700 group-hover:scale-150"
          style={{ backgroundImage: `url('${imgSrc}')` }}
        ></div>
        <img 
          src={imgSrc} 
          alt="Preview" 
          className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {e.currentTarget.style.display='none'}}
        />
      </div>
    );
  }

  return (
    <div className={`w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 ${className}`}>
       <Globe className="text-slate-300 w-8 h-8 mb-2" />
       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{meta?.provider || "External Link"}</span>
    </div>
  );
};

// --- KOMPONEN SVG CUSTOM ---
const IconDapodik = () => ( <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="60" cy="95" rx="50" ry="15" fill="black" fillOpacity="0.2" filter="url(#blur)"/> <path d="M60 85L10 60L60 35L110 60L60 85Z" fill="#AEE2FF"/> <path d="M10 60L60 85V100L10 75V60Z" fill="#60A5FA"/> <path d="M110 60L60 85V100L110 75V60Z" fill="#3B82F6"/> <path d="M70 65L30 45L70 25L110 45L70 65Z" fill="#60A5FA"/> <path d="M30 45L70 65V90L30 70V45Z" fill="#2563EB"/> <path d="M110 45L70 65V90L110 70V45Z" fill="#3B82F6"/> <path d="M40 50L20 40L40 30L60 40L40 50Z" fill="#FBBF24"/> <path d="M20 40L40 50V65L20 55V40Z" fill="#D97706"/> <path d="M60 40L40 50V65L60 55V40Z" fill="#F59E0B"/> <defs><filter id="blur" x="0" y="75" width="120" height="40" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter></defs> </svg> );
const IconPPDB = () => ( <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="60" cy="95" rx="50" ry="15" fill="black" fillOpacity="0.2" filter="url(#blur_ppdb)"/> <path d="M60 85L10 60L60 35L110 60L60 85Z" fill="#FEF3C7"/> <path d="M10 60L60 85V100L10 75V60Z" fill="#FCD34D"/> <path d="M110 60L60 85V100L110 75V60Z" fill="#FBBF24"/> <path d="M85 55L35 30L75 10L115 35L85 55Z" fill="#FBBF24"/> <path d="M80 52L40 32L70 17L110 37L80 52Z" fill="white"/> <rect x="55" y="30" width="30" height="4" transform="rotate(-26.5 55 30)" fill="#E5E7EB"/> <rect x="50" y="38" width="40" height="4" transform="rotate(-26.5 50 38)" fill="#E5E7EB"/> <rect x="45" y="46" width="40" height="4" transform="rotate(-26.5 45 46)" fill="#E5E7EB"/> <path d="M25 55L75 80L115 60L75 35L25 55Z" fill="#FCD34D" fillOpacity="0.8"/> <path d="M25 55L75 80V95L25 70V55Z" fill="#F59E0B"/> <defs><filter id="blur_ppdb" x="0" y="75" width="120" height="40" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter></defs> </svg> );
const IconSimpatika = () => ( <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="60" cy="95" rx="50" ry="15" fill="black" fillOpacity="0.2" filter="url(#blur_sim)"/> <path d="M60 85L10 60L60 35L110 60L60 85Z" fill="#D1FAE5"/> <path d="M10 60L60 85V100L10 75V60Z" fill="#6EE7B7"/> <path d="M110 60L60 85V100L110 75V60Z" fill="#34D399"/> <path d="M90 45 C 90 25, 30 25, 30 45 V 70 C 30 90, 90 90, 90 70 V 60 H 65 V 50 H 100 V 70 C 100 95, 20 95, 20 70 V 45 C 20 15, 100 15, 100 45 Z" fill="#047857"/> <path d="M90 40 C 90 20, 30 20, 30 40 V 65 C 30 85, 90 85, 90 65 V 55 H 65 V 45 H 100 V 65 C 100 90, 20 90, 20 65 V 40 C 20 10, 100 10, 100 40 Z" fill="white"/> <path d="M100 40 C 100 25, 75 15, 60 15 L 60 25 C 75 25, 90 30, 90 40 Z" fill="#FBBF24"/> <path d="M60 15 C 45 15, 20 25, 20 40 L 30 40 C 30 30, 45 25, 60 25 Z" fill="#3B82F6"/> <path d="M20 40 V 65 C 20 80, 40 90, 60 90 L 60 80 C 45 80, 30 75, 30 65 V 40 Z" fill="#10B981"/> <defs><filter id="blur_sim" x="0" y="75" width="120" height="40" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter></defs> </svg> );
const IconLapor = () => ( <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"> <ellipse cx="60" cy="95" rx="50" ry="15" fill="black" fillOpacity="0.2" filter="url(#blur_lapor)"/> <path d="M60 85L10 60L60 35L110 60L60 85Z" fill="#FFE4E6"/> <path d="M10 60L60 85V100L10 75V60Z" fill="#FDA4AF"/> <path d="M110 60L60 85V100L110 75V60Z" fill="#F43F5E"/> <path d="M95 55 L 25 20 L 25 55 L 45 65 L 45 80 L 65 75 L 95 90 L 95 55 Z" fill="#BE123C"/> <path d="M95 50 L 25 15 L 25 50 L 45 60 L 45 75 L 65 70 L 95 85 L 95 50 Z" fill="#F43F5E"/> <rect x="40" y="35" width="40" height="5" transform="rotate(-26.5 40 35)" fill="white" fillOpacity="0.9"/> <rect x="35" y="45" width="50" height="5" transform="rotate(-26.5 35 45)" fill="white" fillOpacity="0.9"/> <rect x="30" y="55" width="30" height="5" transform="rotate(-26.5 30 55)" fill="white" fillOpacity="0.9"/> <defs><filter id="blur_lapor" x="0" y="75" width="120" height="40" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceGraphic" stdDeviation="5"/></filter></defs> </svg> );

// --- KOMPONEN UTAMA HOMEPAGE ---
const HomePage = () => {
  const navigate = useNavigate();
  
  const [highlightBerita, setHighlightBerita] = useState<NewsItem[]>([]);
  const [agendaData, setAgendaData] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const infoLainnyaRef = useRef<HTMLDivElement>(null);
  const terkiniRef = useRef<HTMLDivElement>(null); 

  const fetchInterval = 15000; 
  const heroImages = [
    "/images/bg-beranda/Hardiknas.JPG",        
    "/images/bg-beranda/SisiDepan.jpg",        
    "/images/dinaspendidikan.jpg", 
  ];

  // --- LOGIKA KALENDER REALTIME ---
  const today = new Date();
  const currentMonthName = today.toLocaleDateString("id-ID", { month: "long" });
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, today.getMonth(), 1).getDay(); // 0 (Minggu) s/d 6 (Sabtu)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agendaRes, newsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/public/agenda`),
          axios.get(`${API_BASE_URL}/public/berita-highlight`)
        ]);
        setAgendaData(agendaRes.data);
        setHighlightBerita(newsRes.data);
      } catch (err) {
        console.error("Gagal load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const channel = new BroadcastChannel('agenda_updates');
    channel.onmessage = (event) => {
       if (event.data.action === 'refresh_agenda') {
         fetchData(); 
       }
    };

    const interval = setInterval(fetchData, fetchInterval);
    return () => { clearInterval(interval); channel.close(); };
  }, []);

  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const listSorotanUtama = highlightBerita.filter((item) => Number(item.highlight) === 1);
  const sorotanUtama = listSorotanUtama[0]; 
  const beritaTerbaruList = highlightBerita.filter((item) => Number(item.highlight) === 0);

  const mainAgenda = agendaData.find((item) => item.type === "main");
  const gridAgendas = agendaData.filter((item) => item.type === "grid");

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth; 
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollInfoLainnya = (direction: 'left' | 'right') => {
    if (infoLainnyaRef.current) {
      const { current } = infoLainnyaRef;
      const scrollAmount = 280; 
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollTerkini = (direction: 'left' | 'right') => {
    if (terkiniRef.current) {
      const { current } = terkiniRef;
      const scrollAmount = 300; 
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const getDisplayCaption = (item: AgendaItem) => {
    if (item.captionSource === "manual") return item.description;
    if (item.mediaMeta?.caption) return item.mediaMeta.caption;
    return "Konten ini diambil dari tautan eksternal. Silakan klik tombol untuk melihat detailnya.";
  };

  const StatusBadge = ({ label }: { label: string }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100/50 text-blue-700 border border-blue-200">
      {label}
    </span>
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 w-full">
       <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-sm font-semibold text-slate-500 tracking-widest uppercase">Memuat Portal...</p>
    </div>
  );

  return (
    <main className="w-full max-w-full overflow-x-hidden flex flex-col min-h-screen">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <section className="relative w-full bg-slate-900">
        {/* === BACKGROUND HERO === */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[1500ms] ease-in-out
                ${index === currentIndex ? 'opacity-100 scale-105 z-10' : 'opacity-0 scale-100 z-0'} 
              `}
              style={{ backgroundImage: `url('${img}')` }}
            ></div>
          ))}
          <div className="absolute inset-0 bg-slate-900/70 md:bg-slate-900/50 z-20 pointer-events-none mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-20 pointer-events-none"></div>
        </div>

        {/* === KONTEN TEKS HERO === */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-64 md:pt-40 md:pb-64 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight [text-shadow:_0_2px_10px_rgba(0,0,0,0.6)]">
              Dinas Pendidikan & Kebudayaan <br className="hidden md:block" />
              <span className="relative inline-block mt-2 [text-shadow:_0_2px_4px_rgba(0,0,0,0.9)] pb-2">
                Kota Palu
              </span>
            </h1>
            <p className="mt-8 text-sm md:text-xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed [text-shadow:_0_1px_6px_rgba(0,0,0,0.8)]">
              Mewujudkan pendidikan yang berkualitas, berkarakter, dan berbudaya untuk generasi cerdas masa depan.
            </p>
          </motion.div>
        </div>

        {/* === 3D ICONS SLIDER === */}
        <div className="absolute bottom-0 left-0 right-0 z-40 w-full translate-y-1/2">
          <div className="relative w-full max-w-full md:max-w-7xl mx-auto px-2 md:px-0">
            <button 
              onClick={() => scroll('left')}
              className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-50 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-blue-900 border border-slate-100 active:scale-95 transition-transform backdrop-blur-sm"
            >
              <ChevronLeft size={16}/>
            </button>

            <div 
              ref={scrollRef}
              className="hide-scrollbar flex items-start overflow-x-auto snap-x snap-mandatory scroll-smooth md:overflow-visible md:justify-center md:gap-8 pb-4 w-full"
            >
              {[
                { icon: <IconDapodik />, label: "Dapodik" },
                { icon: <IconPPDB />, label: "PPDB Online" },
                { icon: <IconSimpatika />, label: "Simpatika GTK" },
                { icon: <IconLapor />, label: "Lapor Pengaduan" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="w-1/2 md:w-auto flex-shrink-0 snap-start flex flex-col items-center group cursor-pointer pointer-events-auto px-1"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-3 drop-shadow-2xl">
                    <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full">
                      {item.icon}
                    </div>
                  </div>
                  <p className="mt-3 md:mt-5 text-slate-800 font-extrabold text-[10px] md:text-sm text-center bg-white/95 backdrop-blur-xl px-4 py-2 rounded-xl shadow-xl border border-white whitespace-nowrap min-w-[90px] transition-colors group-hover:text-blue-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => scroll('right')}
              className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 z-50 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-blue-900 border border-slate-100 active:scale-95 transition-transform backdrop-blur-sm"
            >
              <ChevronRight size={16}/>
            </button>
          </div>
        </div>
      </section>

      {/* ================= BERITA SECTION ================= */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 bg-slate-50 relative font-sans z-30 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6 w-full">
            <div className="flex items-center gap-5 w-full md:w-auto justify-center md:justify-start relative">
              <div className="absolute left-0 top-0 w-20 h-20 bg-blue-400 blur-[40px] opacity-30 pointer-events-none hidden md:block"></div>
              <div className="relative shrink-0 hidden sm:flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 shadow-[0_8px_30px_rgba(37,99,235,0.4)] border border-white/20">
                <Newspaper size={30} className="text-white" strokeWidth={1.5} />
              </div>
              <div className="text-center md:text-left z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Sorotan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Artikel</span>
                </h2>
              </div>
            </div>
            
            <button onClick={() => navigate('/berita')} className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700 transition-all bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md group">
              Semua Berita <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 w-full">
            
            {/* === KOLOM KIRI (UTAMA + TERKINI) === */}
            <div className="lg:col-span-2 flex flex-col min-w-0 w-full relative">
              
              {sorotanUtama && (
                <div onClick={() => navigate(`/berita/${sorotanUtama.slug}`)} className="relative w-full rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 group cursor-pointer bg-slate-900 h-[400px] md:h-[500px]">
                  <img 
                    src={sorotanUtama.gambar_url || sorotanUtama.thumbnail} 
                    alt={sorotanUtama.judul} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent opacity-95 group-hover:opacity-90 transition-opacity" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col justify-end h-full z-20">
                    <div className="absolute top-6 left-6 md:top-8 md:left-8">
                      <span className="bg-rose-600 text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-lg shadow-lg tracking-widest flex items-center gap-2 uppercase">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> Headline
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-3 md:mb-4 line-clamp-3 group-hover:text-blue-300 transition-colors break-all w-full">
                      {sorotanUtama.judul}
                    </h3>
                    <p className="text-slate-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 leading-relaxed mb-4 md:mb-2 font-medium break-all whitespace-normal w-full">
                      {sorotanUtama.excerpt}
                    </p>
                  </div>
                </div>
              )}

              {/* --- DEKORASI SUB-HEADER: UPDATE TERKINI --- */}
              <div className="mt-12 mb-6 flex items-center w-full">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 z-10">
                  <Clock size={18} className="text-blue-600" strokeWidth={2.5} />
                  <h3 className="font-extrabold text-sm md:text-base text-slate-800 uppercase tracking-widest whitespace-nowrap">
                    Update Terkini
                  </h3>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent ml-2"></div>
              </div>

              {/* 2. INFORMASI TERKINI */}
              <div className="relative w-full group/slider-terkini">
                <button onClick={() => scrollTerkini('left')} className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-white/95 rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition backdrop-blur-sm -ml-3">
                  <ChevronLeft size={16}/>
                </button>

                <div ref={terkiniRef} className="hide-scrollbar flex flex-row lg:flex-col gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth w-full pb-6 lg:pb-0 px-2 pt-2 -mx-2">
                  {beritaTerbaruList.slice(0, 2).map((berita) => (
                    <div key={berita.id} onClick={() => navigate(`/berita/${berita.slug}`)} 
                         className="snap-center shrink-0 w-[85vw] sm:w-[320px] lg:w-full flex flex-col lg:flex-row items-start group cursor-pointer bg-white p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200 h-auto">
                      
                      <div className="w-full lg:w-[260px] aspect-[16/10] shrink-0 rounded-2xl overflow-hidden relative bg-slate-100 shadow-inner">
                          <img 
                            src={berita.gambar_url || berita.thumbnail} 
                            alt={berita.judul} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            crossOrigin="anonymous"
                          />
                      </div>
                      
                      <div className="flex flex-col flex-1 min-w-0 w-full justify-center mt-4 lg:mt-0 lg:ml-6 pb-2 overflow-hidden">
                        <div className="flex items-center gap-3 mb-3">
                            <StatusBadge label="New" />
                            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                              <Calendar size={12}/> {new Date(berita.published_at).toLocaleDateString("id-ID")}
                            </span>
                        </div>
                        <h4 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-2 break-all w-full">
                          {berita.judul}
                        </h4>
                        <p className="text-sm text-slate-500 line-clamp-2 md:line-clamp-3 leading-relaxed font-medium break-all whitespace-normal w-full">
                          {berita.excerpt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => scrollTerkini('right')} className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-white/95 rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition backdrop-blur-sm -mr-3">
                  <ChevronRight size={16}/>
                </button>
              </div>
            </div>

            {/* === KOLOM KANAN (Lainnya + Kalender) === */}
            <div className="flex flex-col lg:mt-0 min-w-0 w-full relative">
              
              {/* --- DEKORASI SUB-HEADER: LAINNYA --- */}
              <div className="flex items-center w-full mb-6 mt-10 md:mt-0">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 z-10">
                  <Layers size={18} className="text-slate-600" strokeWidth={2.5} />
                  <h3 className="font-extrabold text-sm md:text-base text-slate-800 uppercase tracking-widest whitespace-nowrap">
                    Lainnya
                  </h3>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent ml-2"></div>
              </div>
              
              {/* 3. INFORMASI LAINNYA */}
              <div className="relative mb-12 group/slider w-full">
                <div className="relative w-full">
                  <button onClick={() => scrollInfoLainnya('left')} className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-white/95 rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition backdrop-blur-sm -ml-3">
                    <ChevronLeft size={16}/>
                  </button>

                  <div ref={infoLainnyaRef} className="hide-scrollbar flex flex-row lg:flex-col gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth w-full pb-6 lg:pb-0 px-2 pt-2 -mx-2">
                    {beritaTerbaruList.slice(2, 6).map((berita) => (
                      <Link key={berita.id} to={`/berita/${berita.slug}`} 
                        className="snap-center shrink-0 w-[75vw] sm:w-[280px] lg:w-full flex flex-col lg:flex-row gap-4 items-start group bg-white p-4 rounded-3xl lg:rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-slate-300 h-auto"
                      >
                        <div className="relative w-full lg:w-[90px] aspect-[16/10] lg:aspect-square lg:h-[90px] flex-shrink-0 rounded-2xl lg:rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                          <img 
                              src={berita.gambar_url || berita.thumbnail} 
                              alt={berita.judul} 
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                              crossOrigin="anonymous"
                            />
                        </div>
                        <div className="flex flex-col justify-center flex-1 min-w-0 w-full overflow-hidden mt-1 lg:mt-0">
                          <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <Calendar size={10} /> {new Date(berita.published_at).toLocaleDateString("id-ID")}
                              </span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-base lg:text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 break-all w-full mb-1">
                            {berita.judul}
                          </h4>
                          <p className="text-sm text-slate-500 line-clamp-2 lg:line-clamp-1 leading-relaxed font-medium break-all whitespace-normal w-full">
                            {berita.excerpt}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <button onClick={() => scrollInfoLainnya('right')} className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-30 w-9 h-9 bg-white/95 rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition backdrop-blur-sm -mr-3">
                    <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              {/* 4. KALENDER WIDGET MODERN (DIBUAT REALTIME SESUAI WAKTU SEKARANG) */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl sticky top-24 border border-slate-800 w-full">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <h3 className="font-extrabold text-sm md:text-base uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10 text-indigo-50">
                    <div className="p-2 bg-indigo-500/30 rounded-lg border border-indigo-400/50">
                      <CalendarDays size={18} className="text-indigo-300" /> 
                    </div>
                    Agenda Bulan Ini
                  </h3>
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-inner w-full">
                    
                    {/* Header Bulan dan Tahun Dinamis */}
                    <div className="flex justify-between items-center mb-5 border-b border-white/10 pb-4">
                        <span className="text-sm font-bold tracking-wide uppercase">{currentMonthName} {currentYear}</span>
                    </div>
                    
                    {/* Render Hari dan Tanggal Dinamis */}
                    <div className="grid grid-cols-7 text-center gap-2 w-full">
                      {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((d, i) => (<div key={i} className="text-[10px] font-black text-indigo-300 mb-2">{d}</div>))}
                      
                      {/* Padding blok kosong sebelum tanggal 1 agar sesuai dengan hari aslinya */}
                      {[...Array(firstDayOfMonth)].map((_, i) => (
                         <div key={`empty-${i}`} className="w-8 h-8 mx-auto"></div>
                      ))}
                      
                      {/* Loop Tanggal Bulan Ini (Menandai Otomatis Hari Ini) */}
                      {[...Array(daysInMonth)].map((_, i) => {
                         const dayNum = i + 1;
                         const isToday = dayNum === currentDate;
                         return (
                           <div key={dayNum} className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs font-bold cursor-pointer transition-all ${isToday ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-110 ring-2 ring-indigo-300" : "text-slate-300 hover:bg-white/10"}`}>
                             {dayNum}
                           </div>
                         );
                      })}
                    </div>

                  </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* === SECTION AGENDA / PENGUMUMAN === */}
      <section className="py-20 md:py-32 bg-white relative font-sans border-t border-slate-100 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
          
          {/* --- DEKORASI HEADER MODERN: AGENDA --- */}
          <div className="flex flex-col items-center text-center mb-16 md:mb-20">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-30 rounded-full"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl flex items-center justify-center shadow-xl border border-white/20 rotate-3">
                <Megaphone size={36} strokeWidth={1.5} className="-rotate-3" />
              </div>
            </div>
            <p className="text-indigo-600 font-black tracking-widest uppercase text-[10px] md:text-xs mb-2">
              Event & Publikasi Resmi
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Sorotan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Agenda</span>
            </h2>
          </div>

          {/* 1. POSTER UTAMA */}
          {mainAgenda && (
            <div className="relative w-full max-w-6xl mx-auto h-auto flex flex-col md:flex-row items-stretch md:items-center mb-20 md:mb-28 px-0">
              {/* IMAGE CONTAINER */}
              <div className="relative z-20 w-full md:w-[45%] aspect-[4/3] md:aspect-auto md:min-h-[400px] bg-slate-100 rounded-t-3xl md:rounded-[2rem] overflow-hidden shadow-2xl md:-mr-12 shrink-0 order-1 border-[6px] border-white">
                  <MediaContent item={mainAgenda} className="w-full h-full object-cover" />
              </div>

              {/* CONTENT BOX */}
              <div className={`
                  relative z-10 w-full md:flex-1 h-auto
                  bg-blue-400 
                  rounded-b-3xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(37,99,235,0.08)] 
                  flex flex-col justify-center 
                  p-8 md:p-14 md:pl-24 
                  text-slate-900 border border-blue-100 
                  -mt-4 md:-mt-0 order-2`
                  }>
                <div className="flex flex-col h-full justify-center text-center md:text-left w-full">
                  <div className="mb-6"> 
                    {mainAgenda.dateLocation && (
                      <div className="flex justify-center md:justify-start mb-5 w-full">
                          <div className="inline-flex items-center gap-2 bg-white/80 text-blue-700 px-5 py-2 rounded-xl font-mono text-[10px] md:text-xs font-bold uppercase tracking-widest border border-blue-200 shadow-sm backdrop-blur-sm">
                              <Calendar size={14}/> {mainAgenda.dateLocation}
                          </div>
                      </div>
                    )}
                    <h3 className="text-2xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900 mb-2 break-words w-full">
                      {mainAgenda.title}
                    </h3>
                  </div>

                  <div className="md:border-l-4 md:border-blue-500 md:pl-6 mb-8 flex-1 w-full">
                    <p className="text-sm md:text-lg text-slate-800 leading-relaxed line-clamp-3 md:line-clamp-none font-medium text-slate-700 break-words w-full">
                      {getDisplayCaption(mainAgenda)}
                    </p>
                  </div>

                  <div className="flex justify-center md:justify-start mt-2 w-full"> 
                    <a href={mainAgenda.targetUrl} target="_blank" rel="noreferrer"
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-3 active:scale-95"
                    >
                      {mainAgenda.buttonText} <ArrowRight size={18}/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* 2. GRID INFORMASI (PENGUMUMAN LAINNYA) DIJADIKAN SLIDER INTERAKTIF */}
          {gridAgendas.length > 0 && (
            <div className="relative w-full max-w-7xl mx-auto px-0 group/slider">
              
              {/* --- DEKORASI SUB-HEADER: PENGUMUMAN LAINNYA --- */}
              <div className="flex items-center w-full mb-10 pl-2">
                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-200 z-10">
                  <h3 className="font-extrabold text-base md:text-lg text-slate-800 uppercase tracking-widest whitespace-nowrap">
                    Pengumuman Lainnya
                  </h3>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent ml-2"></div>
              </div>

              <div className="relative w-full"> 
                  
                  {/* TOMBOL PANAH KIRI (Tampil di semua device layaknya berita) */}
                  <button 
                    onClick={() => {
                        const container = document.getElementById('grid-slider-container');
                        if(container) container.scrollBy({ left: -320, behavior: 'smooth' });
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/95 rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition backdrop-blur-sm -ml-3 lg:-ml-5 hover:bg-slate-50"
                  >
                    <ChevronLeft size={20}/>
                  </button>

                  <div 
                    id="grid-slider-container"
                    className="flex gap-6 overflow-x-auto pb-10 px-2 scroll-smooth scrollbar-hide snap-x snap-mandatory pt-2 w-full"
                  >
                    {gridAgendas.map((item) => (
                      <div 
                        key={item.id} 
                        className="snap-center shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-[460px] flex flex-col rounded-[2rem] overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group/card"
                      >
                        <div className="h-56 bg-slate-100 relative overflow-hidden shrink-0">
                          <MediaContent item={item} />
                          <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-500 pointer-events-none"></div>
                        </div>

                        <div className="p-6 md:p-8 flex-1 flex flex-col relative bg-white min-h-0 w-full">
                          <div className="flex-1 min-h-0 flex flex-col w-full overflow-hidden">
                            <h3 className="text-lg font-extrabold text-slate-900 leading-snug mb-3 line-clamp-2 shrink-0 group-hover/card:text-indigo-600 transition-colors break-all overflow-hidden w-full" title={item.title}>
                              {item.title || "Tanpa Judul"}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-medium break-all overflow-hidden w-full">
                              {getDisplayCaption(item) || "Tidak ada deskripsi tambahan."}
                            </p>
                          </div>

                          <div className="mt-6 pt-5 border-t border-slate-100 shrink-0 w-full">
                            <a 
                              href={item.targetUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              // SCRIPT UBAH WARNA TOMBOL LINK (Hitam ke-abuan dikit)
                              className="w-full bg-slate-700 hover:bg-slate-800 text-slate-50 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors active:scale-95 border border-slate-600 shadow-sm"
                            >
                              {item.buttonText} <ExternalLink size={16} className="opacity-80"/>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* TOMBOL PANAH KANAN (Tampil di semua device layaknya berita) */}
                  <button 
                    onClick={() => {
                        const container = document.getElementById('grid-slider-container');
                        if(container) container.scrollBy({ left: 320, behavior: 'smooth' });
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/95 rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-700 active:scale-95 transition backdrop-blur-sm -mr-3 lg:-mr-5 hover:bg-slate-50"
                  >
                    <ChevronRight size={20}/>
                  </button>
              </div>

            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default HomePage;