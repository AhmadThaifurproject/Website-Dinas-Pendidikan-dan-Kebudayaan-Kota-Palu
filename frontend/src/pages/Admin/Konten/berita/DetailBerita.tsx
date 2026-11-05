import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; 
import { motion } from 'framer-motion';
import { Calendar, User, Tag as TagIcon, ArrowLeft, Clock } from "react-feather";

// --- KONFIGURASI API (DINAMIS) ---
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Tag {
  id: number;
  nama: string;
}

interface Berita {
  id?: number;
  title: string;
  isi_berita?: string;
  penulis?: string;
  tanggal_upload?: string;
  tags?: Tag[];
}

function DetailBerita() {
  const { slug } = useParams();
  
  const [berita, setBerita] = useState<Berita | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBerita = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/public/berita/${slug}`);
        const raw = res.data;
        const b = raw.data;

        setBerita({
          id: b.id,
          title: b.judul,
          isi_berita: b.isi_berita,
          penulis: b.penulis,
          tanggal_upload: b.tanggal_upload,
          tags: b.tags,
        });
      } catch (err: any) {
        const msg = err.response?.status === 404 ? "Berita tidak ditemukan" : "Terjadi kesalahan koneksi";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBerita();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Memuat konten berita...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 px-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Ops! Gagal</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link to="/berita" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
          <ArrowLeft size={18}/> Kembali ke Berita
        </Link>
      </div>
    </div>
  );

  if (!berita) return null;

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ================= HEADER / BANNER SECTION (Style Referensi) ================= */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-32 pb-48 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

          {/* Content Container */}
          <div className="relative container mx-auto max-w-5xl text-center z-10">
            
            {/* Breadcrumb */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center gap-2 text-sm text-indigo-300 font-medium tracking-widest uppercase mb-8"
            >
              <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
              <span className="text-slate-500">•</span>
              <Link to="/berita" className="hover:text-white transition-colors">Berita</Link>
            </motion.div>

            {/* Main Title Berita */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8 leading-tight drop-shadow-2xl px-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                {berita.title}
              </span>
            </motion.h1>

            {/* Meta Data di Banner */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="flex flex-wrap justify-center items-center gap-6 text-slate-400 text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <User size={16} className="text-indigo-400" />
                <span>{berita.penulis || "Admin"}</span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-slate-700 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />
                <span>{berita.tanggal_upload ? new Date(berita.tanggal_upload).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT SECTION (Style Referensi Card) ================= */}
      <div className="relative z-30 -mt-24 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Kolom Artikel Utama */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-12 relative overflow-hidden"
            >
              {/* Glow accent inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-40 pointer-events-none"></div>
              
              {/* Isi Berita Render */}
              <article className="relative z-10">
                <div
                  className="prose prose-lg md:prose-xl prose-slate max-w-none text-slate-700 leading-relaxed
                             prose-img:rounded-3xl prose-img:shadow-2xl prose-img:mx-auto prose-a:text-indigo-600 prose-strong:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: berita.isi_berita || "" }}
                />
              </article>

              {/* Tag Section di bawah artikel */}
              {berita.tags && berita.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-3">
                  {berita.tags.map((tag) => (
                    <Link 
                      key={tag.id} 
                      to={`/tag/${tag.nama}`} 
                      className="inline-flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      <TagIcon size={14} /> #{tag.nama}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Sidebar (Modern Style) */}
            <div className="space-y-8">
              {/* Widget: Info Tambahan */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#0f172a] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-2xl rounded-full"></div>
                 <h3 className="text-xl font-bold mb-4 relative z-10">Berita Terkait</h3>
                 <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">
                   Tetap terhubung dengan informasi terbaru seputar pendidikan di Kota Palu.
                 </p>
                 <Link to="/berita" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
                    Lihat Semua Berita <ArrowLeft className="rotate-180" size={16}/>
                 </Link>
              </motion.div>

              {/* Widget: Berita Populer */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                   Terbaru
                </h3>
                <ul className="space-y-6">
                  <li className="group cursor-pointer">
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Informasi</p>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">Penerimaan Peserta Didik Baru (PPDB) Tahun 2026/2027</h4>
                  </li>
                  <li className="group cursor-pointer">
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Prestasi</p>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">Siswa Kota Palu Meraih Medali Emas Olimpiade Sains</h4>
                  </li>
                </ul>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailBerita;