// src/pages/Public/NewsPage.tsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Calendar, User, Search, ArrowRight, Eye } from "react-feather";
import { Link } from 'react-router-dom';
import { extractFirstImage } from "../../../utils/helper"; 

// --- KONFIGURASI API ---
const API_BASE_URL = import.meta.env.VITE_API_URL;
const ITEMS_PER_PAGE = 6; 

const createExcerpt = (htmlContent: string, maxLength: number = 75) => {
  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  const text = div.textContent || div.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// --- INTERFACES ---
interface Berita {
  id: number;
  judul: string;
  isi_berita: string;
  gambar_url: string | null;
  penulis: string;
  tanggal_upload: string;
  views: number;
  slug: string;
}

interface NewsCardProps {
  id: number;
  title: string;
  date: string;
  author: string;
  views: number;
  image: string;
  slug: string;
  content: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// --- COMPONENTS ---

const HeroBanner: React.FC<{ onSearch: (val: string) => void }> = ({ onSearch }) => {
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
                     onChange={(e) => onSearch(e.target.value)}
                     placeholder="Cari berita, agenda, atau pengumuman..." 
                     className="w-full bg-transparent text-slate-800 font-semibold placeholder-slate-300 focus:outline-none text-base h-7"
                   />
                </div>
                <button className="hidden sm:flex bg-[#0f172a] hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg">
                   Temukan
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const NewsCard: React.FC<NewsCardProps> = ({ title, date, author, views, image, slug, content }) => {
  const excerpt = createExcerpt(content, 70);

  const handleViewIncrement = async () => {
    try {
      await axios.post(`${API_BASE_URL}/public/berita/${slug}/increment-view`);
    } catch (error) {
      console.error("Gagal update view:", error);
    }
  };

  return (
    <Link to={`/berita/${slug}`} onClick={handleViewIncrement} className="group block h-full">
      <div className="flex flex-row h-40 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
        <div className="w-[38%] relative overflow-hidden shrink-0">
           <div className="absolute inset-0 bg-slate-100" />
           <img src={image} alt={title} crossOrigin="anonymous" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
           <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors duration-300"></div>
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="mb-1.5">
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Berita</span>
            </div>
            <h3 className="text-[13px] md:text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors mb-1.5">{title}</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 hidden sm:block">{excerpt}</p>
          </div>

          <div className="mt-auto pt-2 border-t border-dashed border-slate-100 flex items-center text-[10px] font-medium text-slate-400">
              <div className="flex items-center gap-1.5 overflow-hidden group-hover:text-blue-600 transition-colors">
                 <User size={11} className="shrink-0"/><span className="truncate max-w-[70px]">{author}</span>
              </div>
              <div className="h-3 w-px bg-slate-200 mx-2.5"></div>
              <div className="flex items-center gap-1.5 shrink-0"><Calendar size={11}/><span>{date}</span></div>
              <div className="ml-auto flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full text-slate-500 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                 <Eye size={10} /><span className="font-semibold">{views}</span>
              </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center mt-20 gap-3">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 transition-all shadow-sm"
      >
        <ArrowRight className="rotate-180" size={18} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
            page === currentPage 
              ? "bg-[#0f172a] text-white shadow-lg" 
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 transition-all shadow-sm"
      >
        <ArrowRight size={18} />
      </button>
    </div>
  );
};

// --- MAIN PAGE ---

const NewsPage: React.FC = () => {
  const [allBerita, setAllBerita] = useState<Berita[]>([]);
  const [filteredBerita, setFilteredBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const prevLengthRef = useRef<number>(0);

  const fetchBerita = async (isInitial: boolean = false) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/public/berita`);
      const data = response.data;
      
      // ✅ TUGAS 2: Urutan Ascending (Lama ke Baru) agar pagination maju = baru
      const sortedData = data.sort((a: Berita, b: Berita) => 
        new Date(a.tanggal_upload).getTime() - new Date(b.tanggal_upload).getTime()
      );

      // Logika Real-time: Hanya render loading jika jumlah data berubah
      if (sortedData.length !== prevLengthRef.current) {
        if (!isInitial) setLoading(true);

        setAllBerita(sortedData);
        setFilteredBerita(sortedData);
        
        // ✅ TUGAS 1: Selalu arahkan ke halaman terbaru (halaman paling akhir)
        const lastPage = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
        setCurrentPage(lastPage || 1);
        
        prevLengthRef.current = sortedData.length;

        if (!isInitial) {
           setTimeout(() => setLoading(false), 600);
        }
      }
      
      if (isInitial) setLoading(false);
    } catch (err) {
      console.error("Error fetching berita:", err);
      setLoading(false);
    }
  };

  // ✅ AUTO SYNC: Setiap 3 Detik
  useEffect(() => {
    fetchBerita(true);
    const interval = setInterval(() => fetchBerita(false), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) {
      setFilteredBerita(allBerita);
      setCurrentPage(Math.ceil(allBerita.length / ITEMS_PER_PAGE) || 1);
      return;
    }
    const filtered = allBerita.filter(item => 
      item.judul.toLowerCase().includes(keyword.toLowerCase()) ||
      item.penulis.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredBerita(filtered);
    setCurrentPage(Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredBerita.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBerita.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC]">
            <div className="w-14 h-14 border-4 border-slate-200 border-t-[#0f172a] rounded-full animate-spin"></div>
            <p className="mt-4 text-xs font-bold text-slate-400 tracking-widest uppercase animate-pulse">Sinkronisasi Data...</p>
        </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-32 font-sans text-slate-800 relative z-10 selection:bg-indigo-100 selection:text-indigo-900">
      <HeroBanner onSearch={handleSearch} />
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-0 mt-12">
        <div className="mb-12">
            <div className="relative pl-6 mb-6">
                <div className="absolute left-0 top-1 bottom-1 w-[4px] bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"></div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-indigo-500 uppercase">Portal Informasi</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                    Sorotan <span className="text-indigo-700">Berita & Agenda</span>
                </h2>
                <p className="text-slate-500 text-sm mt-2 font-normal leading-relaxed max-w-2xl">
                    Data diperbarui otomatis setiap 3 detik. Berita terbaru tersedia di halaman terakhir.
                </p>
            </div>
            <div className="w-full h-[1px] bg-gradient-to-r from-indigo-600 via-indigo-300 to-transparent opacity-80"></div>
        </div>

        {filteredBerita.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {currentItems.map((item) => (
              <NewsCard
                key={item.id}
                id={item.id}
                title={item.judul}
                content={item.isi_berita}
                date={new Date(item.tanggal_upload).toLocaleDateString("id-ID", {
                  day: "numeric", month: "short", year: "numeric",
                })}
                author={item.penulis}
                views={item.views}
                image={item.gambar_url ? item.gambar_url : extractFirstImage(item.isi_berita) || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80"}
                slug={item.slug}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20"><p className="text-slate-400 font-medium">Tidak ada berita ditemukan.</p></div>
        )}

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 600, behavior: 'smooth' });
          }} 
        />
      </div>
    </div>
  );
};

export default NewsPage;