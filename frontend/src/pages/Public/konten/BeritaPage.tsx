import React, { useEffect, useState } from "react";
import { Calendar, User, Search, ArrowRight,Grid, Layers, ChevronRight, Hash,Zap, Activity, Eye } from "react-feather";
import { Link } from 'react-router-dom';
import { extractFirstImage } from "../../../utils/helper"; 

// --- Helper untuk Excerpt ---
const createExcerpt = (htmlContent: string, maxLength: number = 75) => {
  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  const text = div.textContent || div.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// --- Komponen Banner (Tetap Elegan) ---
const HeroBanner: React.FC = () => {
  return (
    <div className="relative z-20 mb-24">
      <div className="bg-[#0f172a] pt-40 pb-44 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

        <div className="relative container mx-auto max-w-5xl text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
            Mewujudkan Pendidikan <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
              Berkualitas & Berbudaya
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
            Akses informasi terkini, transparan, dan akuntabel mengenai perkembangan pendidikan serta pelestarian budaya di Kota Palu.
          </p>
        </div>
      </div>

      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-50">
        <div className="bg-white/30 backdrop-blur-sm p-2 rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20">
            <div className="bg-white rounded-2xl p-2 flex items-center gap-2 shadow-inner">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-slate-50 rounded-xl text-blue-600 shrink-0">
                   <Search size={22} />
                </div>
                <div className="flex-1 flex flex-col justify-center px-3">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Pencarian Cepat</span>
                   <input 
                     type="text" 
                     placeholder="Cari berita, agenda, atau pengumuman..." 
                     className="w-full bg-transparent text-slate-800 font-semibold placeholder-slate-300 focus:outline-none text-base h-7"
                   />
                </div>
                <button className="hidden sm:flex bg-[#0f172a] hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg">
                   Temukan
                </button>
                <button className="sm:hidden bg-[#0f172a] text-white p-3.5 rounded-xl shadow-lg">
                   <Search size={20} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

interface Berita {
  id: number;
  judul: string;
  isi_berita: string;
  image_url: string | null;
  penulis: string;
  tanggal_upload: string;
  views: number; // View ditambahkan kembali
  slug: string;
}

interface NewsCardProps {
  id: number; // ID dibutuhkan untuk API update view
  title: string;
  date: string;
  author: string;
  views: number;
  image: string;
  slug: string;
  content: string;
}

// --- KOMPONEN KARTU BERITA (Dengan Logic Realtime View) ---
const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  date,
  author,
  views,
  image,
  slug,
  content,
}) => {
  const excerpt = createExcerpt(content, 70);

  // --- LOGIC REALTIME VIEW ---
  const handleViewIncrement = async () => {
    try {
      // Kirim request ke backend untuk update jumlah view
      // Endpoint ini harus Anda sesuaikan dengan route API Laravel Anda
      await fetch(`http://localhost:8000/api/berita/${id}/increment-view`, {
        method: 'POST', // Atau 'PATCH' tergantung backend
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Kita tidak perlu menunggu response (await) untuk navigasi, 
      // agar user experience tetap cepat (fire and forget).
    } catch (error) {
      console.error("Gagal update view:", error);
    }
  };

  return (
    <Link 
      to={`/berita/${slug}`} 
      onClick={handleViewIncrement} // Trigger logic saat diklik
      className="group block h-full"
    >
      <div className="flex flex-row h-40 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
        
        {/* IMAGE SECTION */}
        <div className="w-[38%] relative overflow-hidden shrink-0">
           <div className="absolute inset-0 bg-slate-100" />
           <img 
             src={image} 
             alt={title} 
             className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
           />
           <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-300"></div>
        </div>

        {/* CONTENT SECTION */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            {/* Tag & Judul */}
            <div className="mb-1.5">
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    Berita
                </span>
            </div>
            
            <h3 className="text-[13px] md:text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors mb-1.5">
              {title}
            </h3>
            
            <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 hidden sm:block">
              {excerpt}
            </p>
          </div>

          {/* Footer Card (Rapih & Elegan) */}
          <div className="mt-auto pt-2 border-t border-dashed border-slate-100 flex items-center text-[10px] font-medium text-slate-400">
             
             {/* Penulis */}
             <div className="flex items-center gap-1.5 overflow-hidden group-hover:text-blue-600 transition-colors">
                <User size={11} className="shrink-0"/>
                <span className="truncate max-w-[70px]">{author}</span>
             </div>

             {/* Separator Garis */}
             <div className="h-3 w-px bg-slate-200 mx-2.5"></div>

             {/* Tanggal */}
             <div className="flex items-center gap-1.5 shrink-0">
                <Calendar size={11} className=""/>
                <span>{date}</span>
             </div>

             {/* View Count (Pojok Kanan - Highlighted) */}
             <div className="ml-auto flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full text-slate-500 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                <Eye size={10} />
                <span className="font-semibold">{views}</span>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Pagination: React.FC = () => {
  return (
    <div className="flex justify-center items-center mt-20 gap-3">
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
        <ArrowRight className="rotate-180" size={18} />
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0f172a] text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-blue-800 transition-all">
        1
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all shadow-sm">
        2
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm">
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

const NewsPage: React.FC = () => {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/berita")
      .then((res) => res.json())
      .then((data) => {
        setBeritaList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching berita:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC]">
            <div className="w-14 h-14 border-4 border-slate-200 border-t-[#0f172a] rounded-full animate-spin"></div>
            <p className="mt-4 text-xs font-bold text-slate-400 tracking-widest uppercase animate-pulse">Memuat Data...</p>
        </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32 font-sans text-slate-800 relative z-10 selection:bg-indigo-100 selection:text-indigo-900">
      
      <HeroBanner />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-0 mt-12">
        
  {/* --- SECTION HEADER: UNIFIED LUXURY --- */}
<div className="mb-12">
    
    {/* CONTAINER KONTEN (Menyatu) */}
    <div className="relative pl-6 mb-6">
        
        {/* DEKORASI SAMPING (Side Accent) */}
        {/* Garis vertikal tebal dengan warna Indigo memberikan 'jangkar' visual */}
        <div className="absolute left-0 top-1 bottom-1 w-[4px] bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"></div>

        {/* 1. LABEL KECIL (Top) */}
        <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-[0.25em] text-indigo-500 uppercase">
                Portal Informasi
            </span>
        </div>

        {/* 2. JUDUL UTAMA (Middle) */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
            Sorotan <span className="text-indigo-700">Berita & Agenda</span>
        </h2>

        {/* 3. DESKRIPSI (Bottom - Disatukan langsung di bawah judul) */}
        <p className="text-slate-500 text-sm mt-2 font-normal leading-relaxed max-w-2xl">
            Update informasi resmi, pencapaian prestasi, dan kegiatan terkini Dinas Pendidikan.
        </p>
    </div>

    {/* --- GARIS PEMBATAS (SINGLE ELEGANT LINE) --- */}
    {/* Satu garis utuh, warna Indigo, memudar halus ke kanan. Tidak tebal-tipis. */}
    <div className="w-full h-[1px] bg-gradient-to-r from-indigo-600 via-indigo-300 to-transparent opacity-80"></div>

</div>
        {/* --- GRID BERITA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {beritaList.map((item) => {
            const firstContentImage = extractFirstImage(item.isi_berita);

            return (
              <NewsCard
                key={item.id}
                id={item.id} // Passing ID untuk Logic View
                title={item.judul}
                content={item.isi_berita}
                date={new Date(item.tanggal_upload).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short", 
                  year: "numeric",
                })}
                author={item.penulis}
                views={item.views} // Passing Views
                image={
                  item.image_url
                    ? item.image_url
                    : firstContentImage || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80"
                }
                slug={item.slug}
              />
            );
          })}
        </div>

        <Pagination />
      </div>
    </div>
  );
};

export default NewsPage;