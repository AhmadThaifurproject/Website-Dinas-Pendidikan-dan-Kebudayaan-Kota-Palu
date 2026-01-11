import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  ImageIcon, PlayCircle, Globe, School, Users, Star, 
  BookOpen, Building2, ChevronLeft, ChevronRight, 
  Calendar, ExternalLink, MonitorPlay 
} from 'lucide-react';

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
  highlight: boolean;
  published_at: string;
  description?: string;
}

interface DecorProps {
  className?: string;
}

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
}

// --- KOMPONEN HELPER MEDIA (VERSI FINAL: NO CROP & BLURRED BG) ---
const MediaContent = ({ item, className }: { item: AgendaItem; className?: string }) => {
  const meta = item.mediaMeta;
  const url = item.mediaUrl;

  // 1. KOSONG
  if (!url) {
    return (
      <div className={`w-full h-full bg-gray-50 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300 ${className}`}>
        <ImageIcon className="w-8 h-8 mb-2 opacity-30" />
        <span className="text-[10px] font-bold tracking-widest opacity-40 uppercase">No Media</span>
      </div>
    );
  }

  // 2. VIDEO (Local/Blob)
  if (meta?.type === 'video') {
    return (
      <div className={`relative w-full h-full bg-black overflow-hidden flex items-center justify-center ${className}`}>
        {/* Layer 1: Background Blur */}
        <video 
          src={meta.streamUrl || url} 
          className="absolute inset-0 w-full h-full object-cover opacity-40 blur-lg scale-110" 
          muted loop 
        />
        {/* Layer 2: Main Content (Contain) */}
        <video 
          src={meta.streamUrl || url} 
          className="relative z-10 w-full h-full object-contain" 
          muted autoPlay loop playsInline 
        />
      </div>
    );
  }

  // 3. GAMBAR / YOUTUBE THUMBNAIL
  if (meta?.previewUrl || meta?.type === 'image' || (meta?.type === 'external_video' && meta.provider === 'YouTube')) {
    const imgSrc = meta?.previewUrl || url;
    return (
      <div className={`relative w-full h-full bg-black flex items-center justify-center group ${className} overflow-hidden`}>
        {/* Layer 1: Background Blur */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-50 blur-xl scale-125"
          style={{ backgroundImage: `url('${imgSrc}')` }}
        ></div>
        
        {/* Layer 2: Main Content (Contain) */}
        <img 
          src={imgSrc} 
          alt="Preview" 
          className="relative z-10 w-full h-full object-contain transition-opacity duration-300"
          onError={(e) => {e.currentTarget.style.display='none'}}
        />
      </div>
    );
  }

  // 4. FALLBACK
  return (
    <div className={`w-full h-full bg-gray-100 flex flex-col items-center justify-center text-gray-400 ${className}`}>
       <Globe className="text-gray-300 w-8 h-8 mb-2" />
       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{meta?.provider || "External Link"}</span>
    </div>
  );
};

// --- KOMPONEN SVG CUSTOM ---
const IconDapodik = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="95" rx="50" ry="15" fill="black" fillOpacity="0.2" filter="url(#blur)"/>
    <path d="M60 85L10 60L60 35L110 60L60 85Z" fill="#AEE2FF"/>
    <path d="M10 60L60 85V100L10 75V60Z" fill="#60A5FA"/>
    <path d="M110 60L60 85V100L110 75V60Z" fill="#3B82F6"/>
    <path d="M70 65L30 45L70 25L110 45L70 65Z" fill="#60A5FA"/>
    <path d="M30 45L70 65V90L30 70V45Z" fill="#2563EB"/>
    <path d="M110 45L70 65V90L110 70V45Z" fill="#3B82F6"/>
    <path d="M40 50L20 40L40 30L60 40L40 50Z" fill="#FBBF24"/>
    <path d="M20 40L40 50V65L20 55V40Z" fill="#D97706"/>
    <path d="M60 40L40 50V65L60 55V40Z" fill="#F59E0B"/>
    <defs>
      <filter id="blur" x="0" y="75" width="120" height="40" filterUnits="userSpaceOnUse">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
      </filter>
    </defs>
  </svg>
);

const IconPPDB = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="95" rx="50" ry="15" fill="black" fillOpacity="0.2" filter="url(#blur_ppdb)"/>
    <path d="M60 85L10 60L60 35L110 60L60 85Z" fill="#FEF3C7"/>
    <path d="M10 60L60 85V100L10 75V60Z" fill="#FCD34D"/>
    <path d="M110 60L60 85V100L110 75V60Z" fill="#FBBF24"/>
    <path d="M85 55L35 30L75 10L115 35L85 55Z" fill="#FBBF24"/>
    <path d="M80 52L40 32L70 17L110 37L80 52Z" fill="white"/>
    <rect x="55" y="30" width="30" height="4" transform="rotate(-26.5 55 30)" fill="#E5E7EB"/>
    <rect x="50" y="38" width="40" height="4" transform="rotate(-26.5 50 38)" fill="#E5E7EB"/>
    <rect x="45" y="46" width="40" height="4" transform="rotate(-26.5 45 46)" fill="#E5E7EB"/>
    <path d="M25 55L75 80L115 60L75 35L25 55Z" fill="#FCD34D" fillOpacity="0.8"/>
    <path d="M25 55L75 80V95L25 70V55Z" fill="#F59E0B"/>
    <defs>
      <filter id="blur_ppdb" x="0" y="75" width="120" height="40" filterUnits="userSpaceOnUse">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
      </filter>
    </defs>
  </svg>
);

const IconSimpatika = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="95" rx="50" ry="15" fill="black" fillOpacity="0.2" filter="url(#blur_sim)"/>
    <path d="M60 85L10 60L60 35L110 60L60 85Z" fill="#D1FAE5"/>
    <path d="M10 60L60 85V100L10 75V60Z" fill="#6EE7B7"/>
    <path d="M110 60L60 85V100L110 75V60Z" fill="#34D399"/>
    <path d="M90 45 C 90 25, 30 25, 30 45 V 70 C 30 90, 90 90, 90 70 V 60 H 65 V 50 H 100 V 70 C 100 95, 20 95, 20 70 V 45 C 20 15, 100 15, 100 45 Z" fill="#047857"/>
    <path d="M90 40 C 90 20, 30 20, 30 40 V 65 C 30 85, 90 85, 90 65 V 55 H 65 V 45 H 100 V 65 C 100 90, 20 90, 20 65 V 40 C 20 10, 100 10, 100 40 Z" fill="white"/>
    <path d="M100 40 C 100 25, 75 15, 60 15 L 60 25 C 75 25, 90 30, 90 40 Z" fill="#FBBF24"/>
    <path d="M60 15 C 45 15, 20 25, 20 40 L 30 40 C 30 30, 45 25, 60 25 Z" fill="#3B82F6"/>
    <path d="M20 40 V 65 C 20 80, 40 90, 60 90 L 60 80 C 45 80, 30 75, 30 65 V 40 Z" fill="#10B981"/>
    <defs>
      <filter id="blur_sim" x="0" y="75" width="120" height="40" filterUnits="userSpaceOnUse">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
      </filter>
    </defs>
  </svg>
);

const IconLapor = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="60" cy="95" rx="50" ry="15" fill="black" fillOpacity="0.2" filter="url(#blur_lapor)"/>
    <path d="M60 85L10 60L60 35L110 60L60 85Z" fill="#FFE4E6"/>
    <path d="M10 60L60 85V100L10 75V60Z" fill="#FDA4AF"/>
    <path d="M110 60L60 85V100L110 75V60Z" fill="#F43F5E"/>
    <path d="M95 55 L 25 20 L 25 55 L 45 65 L 45 80 L 65 75 L 95 90 L 95 55 Z" fill="#BE123C"/>
    <path d="M95 50 L 25 15 L 25 50 L 45 60 L 45 75 L 65 70 L 95 85 L 95 50 Z" fill="#F43F5E"/>
    <rect x="40" y="35" width="40" height="5" transform="rotate(-26.5 40 35)" fill="white" fillOpacity="0.9"/>
    <rect x="35" y="45" width="50" height="5" transform="rotate(-26.5 35 45)" fill="white" fillOpacity="0.9"/>
    <rect x="30" y="55" width="30" height="5" transform="rotate(-26.5 30 55)" fill="white" fillOpacity="0.9"/>
    <defs>
      <filter id="blur_lapor" x="0" y="75" width="120" height="40" filterUnits="userSpaceOnUse">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5"/>
      </filter>
    </defs>
  </svg>
);

// --- KOMPONEN UTAMA HOMEPAGE ---
const HomePage = () => {
  const navigate = useNavigate();
  // State
  const [highlightBerita, setHighlightBerita] = useState<NewsItem[]>([]);
  const [agendaData, setAgendaData] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const infoLainnyaRef = useRef<HTMLDivElement>(null);

  // Constants
  const fetchInterval = 15000; 
  const heroImages = [
    "/images/bg-beranda/Hardiknas.JPG",        
    "/images/bg-beranda/SisiDepan.jpg",        
    "/images/dinaspendidikan.jpg", 
  ];

// --- FETCHING DATA ---
useEffect(() => {
  const fetchPublicData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/agenda");
      setAgendaData(res.data);
    } catch (err) {
      console.error("Gagal load agenda:", err);
    }
  };

  const fetchHighlight = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/berita/highlight");
      if (!res.ok) throw new Error("Fetch gagal");
      const data = await res.json();
      setHighlightBerita(data);
    } catch (err) {
      console.error("Gagal fetch highlight:", err);
    }
  };

  Promise.all([fetchPublicData(), fetchHighlight()]).finally(() => {
      setLoading(false);
  });

  const channel = new BroadcastChannel('agenda_updates');
  channel.onmessage = (event) => {
     if (event.data.action === 'refresh_agenda') {
        console.log("Data diperbarui oleh Admin, memuat ulang...");
        fetchPublicData(); 
     }
  };

  const interval = setInterval(fetchHighlight, fetchInterval);

  return () => {
    clearInterval(interval);
    channel.close();         
  };

}, []);

  // --- HERO SLIDER LOGIC ---
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

  // --- HELPER FUNCTIONS ---
  const mainAgenda = agendaData.find((item) => item.type === "main");
  const gridAgendas = agendaData.filter((item) => item.type === "grid");
  const highlightUtama = highlightBerita.find((item) => item.highlight === true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth; 
      current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const scrollInfoLainnya = (direction: 'left' | 'right') => {
    if (infoLainnyaRef.current) {
      const { current } = infoLainnyaRef;
      const scrollAmount = 280; 
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const getDisplayCaption = (item: AgendaItem) => {
    if (item.captionSource === "manual") return item.description;
    if (item.mediaMeta?.caption) return item.mediaMeta.caption;
    return "Konten ini diambil dari tautan eksternal. Silakan klik tombol untuk melihat detailnya.";
  };

  const StatusBadge = ({ label }: { label: string }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100">
      {label}
    </span>
  );

  const MobileDivider = ({ label }: { label: string }) => (
    <div className="flex md:hidden items-center gap-4 my-8 w-full">
      <div className="h-[1px] bg-gray-200 flex-1"></div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
        {label}
      </span>
      <div className="h-[1px] bg-gray-200 flex-1"></div>
    </div>
  );

  if (loading) return <div className="py-20 text-center text-gray-400">Memuat Agenda...</div>;

  return (
    <>
    <style>{`
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>

    <section className="relative w-full bg-gray-900">
      {/* === BACKGROUND === */}
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
        <div className="absolute inset-0 bg-gray-900/60 md:bg-gray-900/40 z-20 pointer-events-none"></div>
      </div>

      {/* === KONTEN TEKS === */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-64 md:pt-40 md:pb-64 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
          Pekan Kebudayaan Daerah
        </h1>
        <p className="mt-4 text-base md:text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-md px-2">
          Jelajahi ragam budaya, kreativitas, dan karya masyarakat daerah dalam satu portal dinamis.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition font-semibold hover:shadow-blue-500/30 text-sm md:text-base">
            Jelajahi
          </button>
        </div>
      </div>

      {/* === 3D ICONS SLIDER === */}
      <div className="absolute bottom-0 left-0 right-0 z-40 w-full translate-y-1/2">
        <div className="relative max-w-[320px] md:max-w-7xl mx-auto">
          {/* TOMBOL KIRI */}
          <button 
            onClick={() => scroll('left')}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-50 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-blue-900 border border-gray-100 active:scale-95 transition-transform backdrop-blur-sm"
          >
            <ChevronLeft size={16}/>
          </button>

          {/* LIST SLIDER */}
          <div 
            ref={scrollRef}
            className="hide-scrollbar flex items-start overflow-x-auto snap-x snap-mandatory scroll-smooth md:overflow-visible md:justify-center md:gap-8 pb-4"
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
                <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center transition-transform duration-300 hover:-translate-y-2 drop-shadow-xl">
                  <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full">
                    {item.icon}
                  </div>
                </div>
                <p className="mt-3 md:mt-4 text-gray-800 font-bold text-[10px] md:text-sm text-center bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/50 whitespace-nowrap min-w-[80px]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* TOMBOL KANAN */}
          <button 
            onClick={() => scroll('right')}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-50 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-blue-900 border border-gray-100 active:scale-95 transition-transform backdrop-blur-sm"
          >
            <ChevronRight size={16}/>
          </button>
        </div>
      </div>
    </section>

    {/* ================= BERITA SECTION ================= */}
    <section className="pt-32 pb-20 md:pt-44 md:pb-32 bg-gray-50 relative font-sans z-30">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
           <div className="text-center md:text-left w-full md:w-auto">
             <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 uppercase tracking-tight mb-2">Berita Terkini</h2>
             <div className="h-1.5 w-16 bg-blue-600 mx-auto md:mx-0 rounded-full"></div>
           </div>
           <button onClick={() => navigate('/berita')} className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
             Lihat Semua Berita <span aria-hidden="true">&rarr;</span>
           </button>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* === KOLOM KIRI (UTAMA + TERKINI) === */}
          <div className="lg:col-span-2 flex flex-col">
            {/* 1. SOROTAN UTAMA */}
            {highlightUtama && (
              <div onClick={() => navigate(`/berita/${highlightUtama.slug}`)} className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl group cursor-pointer bg-white h-[400px] md:h-[500px]">
                <img src={highlightUtama.thumbnail} alt={highlightUtama.judul} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col justify-end h-full z-20">
                  <div className="absolute top-5 left-5 md:top-8 md:left-8">
                    <span className="bg-red-600 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-md tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> SOROTAN
                    </span>
                  </div>
                  <h3 className="text-xl md:text-4xl font-extrabold text-white leading-tight mb-3 md:mb-4 line-clamp-3 group-hover:text-blue-300 transition-colors">
                    {highlightUtama.judul}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-lg line-clamp-2 md:line-clamp-3 leading-relaxed mb-4 md:mb-6">
                    {highlightUtama.excerpt}
                  </p>
                </div>
              </div>
            )}

            <MobileDivider label="Informasi Terkini" />

            {/* 2. INFORMASI TERKINI (List Vertikal) */}
            <div className="mt-0 md:mt-10 flex flex-col gap-5">
               <h3 className="hidden md:flex font-bold text-lg text-gray-900 uppercase items-center gap-3 mb-2">
                 <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span> Informasi Terkini
               </h3>

               {highlightBerita.slice(0, 2).map((berita) => (
                 <div key={berita.id} onClick={() => navigate(`/berita/${berita.slug}`)} className="flex flex-col md:flex-row items-start gap-4 md:gap-6 group cursor-pointer bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
                   <div className="w-full md:w-[240px] h-[180px] md:h-[160px] shrink-0 rounded-xl overflow-hidden relative bg-gray-100">
                      <img src={berita.thumbnail} alt={berita.judul} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                   </div>
                   <div className="flex flex-col flex-1 min-w-0 h-full justify-center">
                     <div className="flex items-center gap-2 mb-2">
                        <StatusBadge label="Terbaru" />
                        <span className="text-[10px] md:text-[11px] text-gray-400 font-bold uppercase tracking-wider">{new Date(berita.published_at).toLocaleDateString("id-ID")}</span>
                     </div>
                     <h4 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition leading-snug mb-2 line-clamp-2">
                       {berita.judul}
                     </h4>
                     <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                       {berita.excerpt}
                     </p>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* === KOLOM KANAN (Lainnya + Kalender) === */}
          <div className="flex flex-col lg:mt-0">
            <MobileDivider label="Informasi Lainnya" />
            {/* 3. INFORMASI LAINNYA */}
            <div className="relative mb-10 group/slider">
               <div className="flex justify-between items-center mb-4 md:mb-6">
                 <h3 className="font-bold text-lg text-gray-900 uppercase flex items-center gap-3">
                   <span className="w-1.5 h-6 bg-orange-500 rounded-full hidden md:block"></span>
                   <span className="md:hidden text-2xl">📋</span>
                   Lainnya
                 </h3>
               </div>
               
               <div className="relative">
                 <button onClick={() => scrollInfoLainnya('left')} className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-gray-700 border border-gray-100 active:scale-95 transition backdrop-blur-sm">
                   <ChevronLeft size={16}/>
                 </button>

                 <div ref={infoLainnyaRef} className="hide-scrollbar flex md:flex-col gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth md:overflow-visible pb-4 md:pb-0 px-10 md:px-0">
                   {highlightBerita.slice(2, 6).map((berita) => (
                     <Link key={berita.id} to={`/berita/${berita.slug}`} 
                       className="min-w-[280px] w-[280px] md:w-full snap-center flex-shrink-0 flex flex-col md:flex-row gap-3 md:gap-4 items-start group bg-white p-3 md:p-4 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100"
                     >
                       <div className="relative w-full h-[140px] md:w-[100px] md:h-[100px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                         <img src={berita.thumbnail} alt={berita.judul} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                       </div>
                       <div className="flex flex-col justify-center flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1.5">
                            <StatusBadge label="Info" />
                            <span className="text-[10px] text-gray-400">
                              {new Date(berita.published_at).toLocaleDateString("id-ID")}
                            </span>
                         </div>
                         <h4 className="font-bold text-gray-800 text-sm md:text-sm leading-snug group-hover:text-blue-600 transition line-clamp-2 mb-1">
                           {berita.judul}
                         </h4>
                         <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                            {berita.excerpt}
                         </p>
                       </div>
                     </Link>
                   ))}
                 </div>
                 <button onClick={() => scrollInfoLainnya('right')} className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-gray-700 border border-gray-100 active:scale-95 transition backdrop-blur-sm">
                   <ChevronRight size={16}/>
                 </button>
               </div>
            </div>

            {/* 4. KALENDER */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg sticky top-24">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <h3 className="font-bold text-base uppercase mb-4 tracking-wide flex items-center gap-2 relative z-10">
                   <Calendar size={18} /> Agenda Bulan Ini
                </h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                     <span className="text-sm font-bold">Maret 2025</span>
                  </div>
                  <div className="grid grid-cols-7 text-center gap-1">
                    {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((d, i) => (<div key={i} className="text-[10px] font-bold text-blue-200 mb-2">{d}</div>))}
                    {[...Array(30)].map((_, i) => (
                      <div key={i} className={`w-7 h-7 flex items-center justify-center rounded-full text-[10px] cursor-pointer transition ${i === 13 ? "bg-white text-blue-900 font-bold shadow-lg scale-110" : "text-white/70 hover:bg-white/20"}`}>{i + 1}</div>
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* === SECTION AGENDA (DINAMIS) === */}
    <section className="py-16 md:py-20 bg-white relative font-sans overflow-hidden">
       <div className="max-w-7xl mx-auto px-4 md:px-6">
         {/* HEADER */}
         <div className="text-center mb-10">
           <h2 className="text-2xl md:text-3xl font-extrabold text-black uppercase tracking-wide mb-2">
             SOROTAN AGENDA
           </h2>
           <p className="text-gray-500 text-sm md:text-base px-4">
             Kegiatan unggulan dan acara utama Dinas Pendidikan.
           </p>
         </div>

        {/* 1. POSTER UTAMA (MOBILE OPTIMIZED: STACKED LAYOUT) */}
            {mainAgenda && (
        // 1. UBAH DISINI (DESKTOP WIDTH): 
        // Ganti 'max-w-5xl' menjadi 'max-w-6xl' atau 'max-w-7xl' agar lebih lebar ke kanan.
        <div className="relative w-full max-w-6xl mx-auto md:ml-10 min-h-auto md:min-h-[480px] flex flex-col md:flex-row items-center py-6 mb-12 md:mb-16 px-4 md:px-4">
          
          {/* BAGIAN ATAS (MOBILE) / KIRI (DESKTOP): IMAGE CONTAINER */}
          <div className="relative z-20 w-full md:w-[40%] h-[250px] sm:h-[300px] md:h-[490px] bg-white rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl md:-mr-16 shrink-0 order-1">
              <MediaContent item={mainAgenda} className="w-full h-full" />
              <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>

          {/* BAGIAN BAWAH (MOBILE) / KANAN (DESKTOP): BLUE BOX */}
          <div className={`
              relative z-10 w-full md:flex-1 
              bg-blue-900 rounded-b-3xl md:rounded-[2rem] shadow-xl 
              flex flex-col justify-center 
              p-6 md:p-10 pl-6 md:pl-24 
              text-white border border-blue-800 
              -mt-1 md:-mt-0 order-2
              h-auto min-h-[300px] md:min-h-[380px]`
              }>
            
            <div className="flex flex-col h-full justify-center text-center md:text-left">
              
              <div className="mb-4 md:mb-2"> 
                {mainAgenda.dateLocation && (
                  <div className="flex justify-center md:justify-start">
                      <div className="inline-flex items-center gap-2 text-yellow-400 font-mono text-[10px] md:text-xs uppercase tracking-widest border-b border-yellow-400/50 pb-1 w-fit mb-3">
                          <Calendar size={14}/> {mainAgenda.dateLocation}
                      </div>
                  </div>
                )}
                
                <h3 className="text-xl md:text-3xl font-extrabold leading-tight uppercase drop-shadow-md md:-mt-1">
                  {mainAgenda.title}
                </h3>
              </div>

              <div className="md:border-l-4 md:border-yellow-400 md:pl-4 my-4 md:my-6">
                <p className="text-xs md:text-sm text-blue-100 leading-relaxed line-clamp-3 font-light px-2 md:px-0">
                  {getDisplayCaption(mainAgenda)}
                </p>
              </div>

              <div className="pt-2 md:pt-4 mt-2 flex justify-center md:justify-start"> 
                <a href={mainAgenda.targetUrl} target="_blank" rel="noreferrer"
                  className="w-full md:w-fit bg-yellow-400 hover:bg-yellow-300 text-blue-950 px-6 md:px-8 py-3 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase transition-all shadow-lg hover:shadow-yellow-400/50 flex items-center justify-center gap-2 md:gap-3 active:scale-95"
                >
                  {mainAgenda.buttonText} <ExternalLink size={16}/>
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
         
       {/* 2. GRID INFORMASI (SLIDER MODE) */}
        {gridAgendas.length > 0 && (
          // Main container with strict overflow handling to prevent horizontal scroll on body
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group/slider overflow-hidden">
            
            {/* HEADER SECTION - Aligned with slider content */}
            <div className="flex justify-between items-end mb-6">
              <div className="pl-1"> {/* Tiny padding to match card edge visual */}
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 uppercase tracking-wide leading-none">
                  INFORMASI LAINNYA
                </h2>
                <div className="h-1 w-24 bg-blue-600 mt-3 rounded-full"></div>
              </div>
            </div>

            {/* SLIDER CONTAINER */}
            <div className="relative -mx-4 sm:-mx-0"> 
                <div 
                  id="grid-slider-container"
                  className="flex gap-6 overflow-x-auto pb-8 px-4 sm:px-1 scroll-smooth scrollbar-hide snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {gridAgendas.map((item) => (
                    <div 
                      key={item.id} 
                      className="snap-center shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-[450px] flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/card"
                    >
                      {/* Media Section */}
                      <div className="h-52 bg-slate-50 relative overflow-hidden border-b border-slate-50">
                        <MediaContent item={item} />
                        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex-1 flex flex-col relative">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3 uppercase line-clamp-2 min-h-[3em]" title={item.title}>
                            {item.title || "Tanpa Judul"}
                          </h3>
                          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                            {getDisplayCaption(item) || "Tidak ada deskripsi tambahan."}
                          </p>
                        </div>

                        {/* Action Button */}
                        <div className="mt-5 pt-5 border-t border-slate-100">
                          <a 
                            href={item.targetUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-full bg-slate-900 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md text-center flex items-center justify-center gap-2 transition-all active:scale-95"
                          >
                            {item.buttonText} <ExternalLink size={14} className="opacity-70"/>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
            </div>

            {/* MOBILE NAVIGATION OVERLAY (Visible only on hover in desktop for extra UX) */}
            <button 
              onClick={() => {
                  const container = document.getElementById('grid-slider-container');
                  if(container) container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur shadow-lg border border-slate-100 rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 md:flex hidden z-20"
            >
              <ChevronLeft size={22}/>
            </button>
            <button 
              onClick={() => {
                  const container = document.getElementById('grid-slider-container');
                  if(container) container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur shadow-lg border border-slate-100 rounded-full flex items-center justify-center text-slate-700 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 md:flex hidden z-20"
            >
              <ChevronRight size={22}/>
            </button>

          </div>
        )}
       </div>
    </section>
    </>
  );
};

export default HomePage;