// src/pages/Admin/FormBerita.tsx
import React, { useState, useEffect, useCallback, ChangeEvent, useContext, useRef } from "react";
import { useMemo } from "react";
import axios from "axios"; 
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import "react-quill/dist/quill.snow.css";
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import { extractFirstImage } from "../../../../utils/helper.ts"; 
import UploadToHighlight from "../../../../feature/highlight/UploadToHighlight.tsx"; 
import { getViewBadge } from "../../../../components/Helper/viewBadge.ts"; 
import { 
  User, Calendar, Hash, Image as ImageIcon, 
  Search, Filter, Trash2, Type, PenTool, FolderTree, 
  Save, List, Star, Eye, FileEdit, LayoutTemplate, Layers,
  ChevronDown, Check 
} from 'lucide-react';

// --- IMPORT THEME CONTEXT ---
import { ThemeContextAdmin } from "../../components/theme/ThemeContextAdmin.tsx"; 

// --- KONFIGURASI API (DINAMIS) ---
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Berita {
  id: number;
  judul: string;
  isi_berita: string;
  penulis: string;
  gambar: string;
  tanggal_upload: string;
  slug: string;
  views?: number;
  gambar_url?: string;
  kategori?: string;
  tags?: string[];
  jadwal?: string | null;
}

export default function FormBerita() {
  // --- 1. THEME HOOK INTEGRATION ---
  const context = useContext(ThemeContextAdmin);
  const theme = context?.theme || "light";
  const isLight = theme === "light";

  // --- STATE FORM ---
  const [judul, setJudul] = useState<string>("");
  const [isiBerita, setIsiBerita] = useState<string>("");
  const [penulis, setPenulis] = useState<string>("");
  const [gambar, setGambar] = useState<File | null>(null);
  const [tanggalUpload, setTanggalUpload] = useState<string>(() => getNowLocalDate());

  // List berita & pagination
  const [listBerita, setListBerita] = useState<Berita[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const safeHTML = DOMPurify.sanitize(isiBerita);
  
  // Edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);

  // Search logic
  const [searchQuery, setSearchQuery] = useState("");

  // Refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sidebar state
  const [jadwal, setJadwal] = useState("");
  const [kategori, setKategori] = useState("");
  const [tags, setTags] = useState("");

  const [isMounted, setIsMounted] = useState(false);
  const quillRef = useRef<any>(null);

  // --- STATE KUSTOM DROPDOWN KATEGORI ---
  const [isKategoriOpen, setIsKategoriOpen] = useState(false);
  const kategoriRef = useRef<HTMLDivElement>(null);
  const kategoriOptions = [
    "PAUD Dan PNF", "SD", "SMP", "Ketenagaan GTK",
    "Sub-Bagian Umum dan Kepegawaian", "Kebudayaan",
    "Perencanaan Dan Program", "Sub-Sekretariat", "Aset dan Keuangan"
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (kategoriRef.current && !kategoriRef.current.contains(event.target as Node)) {
        setIsKategoriOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- STYLE HELPERS (MODERN DESIGN) ---
  const mainContainerClass = isLight ? "bg-[#f8fafd]" : "bg-[#0b1120]";
  const cardBgClass = isLight ? "bg-white border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" : "bg-[#131b2f] border-slate-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.4)]";
  const textMain = isLight ? "text-slate-800" : "text-slate-100";
  const textMuted = isLight ? "text-slate-500" : "text-slate-400";
  const placeholderClass = isLight ? "placeholder-slate-400" : "placeholder-slate-500";
  const inputBgClass = isLight ? "bg-slate-50 hover:bg-slate-100/80 focus:bg-white" : "bg-[#0f172a]/50 hover:bg-[#0f172a]/80 focus:bg-[#0f172a]"; 
  const inputFocusClass = "focus:outline-none transition-all";
  const inputBorderClass = isLight ? "border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10" : "border-slate-700/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  // --- HELPER FUNCTIONS ---
  const extractFirstImageSrc = (htmlContent: string) => {
    if (!htmlContent) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const img = doc.querySelector('img');
    return img ? img.src : null;
  };

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const maxSize = 1 * 1024 * 1024; 
      if (file.size > maxSize) {
        Swal.fire({
          icon: "error",
          title: "File Terlalu Besar",
          text: "Maksimal ukuran gambar adalah 1MB agar performa web tetap cepat."
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection(true);
        if (quill) {
          const index = range ? range.index : quill.getLength();
          quill.insertEmbed(index, "image", base64Data);
          quill.setSelection(index + 1); 
        }
      };
      
      reader.onerror = () => { Swal.fire("Error", "Gagal memproses gambar", "error"); };
      reader.readAsDataURL(file);
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }], 
        ['bold', 'italic', 'underline', 'strike'], 
        [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
        ['link', 'image'], 
        [{ 'align': [] }], 
        ['clean'] 
      ],
      handlers: { image: handleImageUpload },
    },
  }), [handleImageUpload]);

  function formatTagsOnInput(raw: string) {
    const parts: { text: string; completed: boolean }[] = [];
    let token = "";
    let i = 0;
    while (i < raw.length) {
      const ch = raw[i];
      if (ch === "," && raw[i + 1] === " ") {
        const t = token.trim();
        parts.push({ text: t, completed: true });
        token = "";
        i += 2; 
        continue;
      }
      token += ch;
      i++;
    }
    if (token.length > 0) parts.push({ text: token.trim(), completed: false });
    let out = "";
    for (let idx = 0; idx < parts.length; idx++) {
      const p = parts[idx];
      if (p.completed) {
        if (p.text) out += (p.text.startsWith("#") ? p.text : `#${p.text}`);
        out += ", ";
      } else {
        out += p.text;
      }
    }
    if (!raw.endsWith(", ") && raw.endsWith(",")) {
      if (!out.endsWith(",")) out += ",";
    }
    return out;
  }

  function handleTagsChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const formatted = formatTagsOnInput(raw);
    setTags(formatted);
  }

  const fetchBerita = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/public/berita`);
      setListBerita(res.data);
    } catch (err: any) {
      console.error("Gagal ambil data berita:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, [refreshTrigger]);

  const handleRefresh = () => { setRefreshTrigger(prev => prev + 1); };

  function resetForm() {
    setJudul(""); setIsiBerita(""); setPenulis(""); setGambar(null);
    setIsEditMode(false); setEditSlug(null); setTanggalUpload(getNowLocalDate());
    setTags(""); setKategori(""); setJadwal("");
  }

  function getNowLocalDate() {
    const d = new Date(); return d.toISOString().slice(0, 10);
  }

  // --- LOGIC SEARCHING REAL-TIME ---
  const filteredBerita = useMemo(() => {
    return listBerita.filter((berita) => {
      if (!searchQuery) return true;
      const lowerQuery = searchQuery.toLowerCase();
      const matchJudul = berita.judul.toLowerCase().includes(lowerQuery);
      const matchPenulis = berita.penulis?.toLowerCase().includes(lowerQuery);
      return matchJudul || matchPenulis;
    });
  }, [listBerita, searchQuery]);

  const itemsPerPage = 4; 

  // --- FIX LOGIC PAGINATION (ASCENDING: Terlama di awal, Terbaru di akhir) ---
  const sortedBerita = [...filteredBerita].sort((a, b) => {
    const ta = a.tanggal_upload ? new Date(a.tanggal_upload).getTime() : 0;
    const tb = b.tanggal_upload ? new Date(b.tanggal_upload).getTime() : 0;
    return ta - tb; // ASCENDING: Hal 1 isinya yg lama, Hal Terakhir isinya yg paling baru
  });

  const totalPages = Math.max(1, Math.ceil(sortedBerita.length / itemsPerPage));

  // Otomatis arahkan ke halaman dengan data terbaru (halaman paling akhir) 
  // setiap kali data berubah (misal saat nambah data) atau user mencari data (search)
  useEffect(() => {
    setCurrentPage(totalPages);
  }, [searchQuery, listBerita.length, totalPages]);

  // Handle pembatasan currentPage agar tidak over-index jika data dihapus
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const currentBerita = sortedBerita.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  async function submitBerita(e?: React.FormEvent) {
    if (e) e.preventDefault(); 
    if (!judul.trim() || !isiBerita.trim() || !kategori.trim()) {
        Swal.fire({ icon: "warning", title: "Data Belum Lengkap", text: "Mohon isi Judul, Kategori, dan Isi Berita." });
        return;
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi_berita", isiBerita);
    formData.append("penulis", penulis);
    formData.append("kategori", kategori);
    if (jadwal) formData.append("tanggal_upload", jadwal);

    const imageFromEditor = extractFirstImageSrc(isiBerita);
    if (imageFromEditor) formData.append("gambar", imageFromEditor); 

    const tagArray = typeof tags === 'string' 
      ? tags.split(",").map((t) => t.trim().replace('#', '')).filter(Boolean)
      : []; 
    if (tagArray.length > 0) tagArray.forEach((t, index) => formData.append(`tags[${index}]`, t));

    let url = `${API_BASE_URL}/admin/berita`;
    
    try {
      const config = { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } };
      if (isEditMode && editSlug) {
        formData.append("_method", "PUT"); 
        await axios.post(`${API_BASE_URL}/admin/berita/${editSlug}`, formData, config);
      } else {
        await axios.post(url, formData, config);
      }
      Swal.fire({ icon: "success", title: "Berita Berhasil Disimpan!", timer: 1500, showConfirmButton: false });
      
      handleRefresh(); // Akan trigger useEffect untuk pindah ke halaman terakhir (terbaru)
      resetForm();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Terjadi kesalahan pada server.";
      Swal.fire({ icon: "error", title: "Gagal Simpan!", text: errorMsg });
    }
  }

  function handleEdit(berita: Berita) {
    setIsEditMode(true); setEditSlug(berita.slug); setJudul(berita.judul);
    setIsiBerita(berita.isi_berita); setPenulis(berita.penulis); setGambar(null);
    setTanggalUpload(berita.tanggal_upload ? berita.tanggal_upload.slice(0, 10) : getNowLocalDate());
    setTags(berita.tags ? berita.tags.join(", ") : ""); setJadwal(berita.jadwal ?? ""); setKategori(berita.kategori ?? "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDelete(slug: string) {
    Swal.fire({
      title: "Yakin ingin menghapus?", icon: "warning", showCancelButton: true,
      confirmButtonColor: "#ef4444", cancelButtonColor: "#64748b", confirmButtonText: "Ya, Hapus!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/admin/berita/${slug}`, { headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` } });
          Swal.fire({ icon: "success", title: "Berita dihapus!", timer: 1500, showConfirmButton: false });
          handleRefresh();
        } catch (err: any) { Swal.fire({ icon: "error", title: "Gagal menghapus!" }); }
      }
    });
  }

  return (
    <div className={`w-full min-h-screen ${mainContainerClass} transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-[90rem] mx-auto space-y-8">
        
        {/* =========================================
            HEADER & ACTIONS
            ========================================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black tracking-widest uppercase mb-2">
                  <PenTool className="w-3.5 h-3.5" /> Ruang Redaksi
              </div>
              <h1 className={`text-3xl lg:text-4xl font-extrabold tracking-tight ${textMain}`}>
                Sistem Publikasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Berita</span>
              </h1>
           </div>
           
           <div className="flex items-center gap-3">
              {isEditMode && (
                <button onClick={resetForm} className="px-6 py-2.5 rounded-xl text-sm font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-all">
                    Batalkan Edit
                </button>
              )}
              <button
                onClick={() => {
                    const isOpening = !showList;
                    setShowList(isOpening);
                    // Langsung panggil ke hal terbaru saat dibuka
                    if(isOpening) setCurrentPage(totalPages); 
                }}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${isLight ? "bg-white border border-slate-200 text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-600" : "bg-[#1e293b] border border-slate-700 text-slate-300 shadow-lg hover:border-blue-500/50 hover:text-blue-400"}`}
              >
                <FolderTree className="w-4 h-4" />
                {showList ? "Tutup Arsip" : "Buka Arsip"}
              </button>
           </div>
        </div>

        {/* =========================================
            MAIN CONTENT: HORIZONTAL STACKING (ATAS-BAWAH)
            ========================================= */}
        <div className="flex flex-col gap-8">
          
          {/* --- BOX 1 (ATAS): INPUT IDENTITAS (LEBAR PENUH) --- */}
          <div className={`${cardBgClass} rounded-[2rem] border p-6 sm:p-8 flex flex-col relative overflow-hidden transition-colors duration-300 w-full`}>
              
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-3xl rounded-full pointer-events-none -mt-10 -mr-10"></div>

              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200/60 dark:border-slate-700/60 relative z-10">
                 <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-md">
                    <LayoutTemplate className="w-5 h-5" />
                 </div>
                 <div>
                    <h2 className={`text-xl font-bold ${textMain} leading-tight`}>Identitas Berita</h2>
                    <p className={`text-sm ${textMuted} mt-0.5`}>Lengkapi detail informasi untuk metadata artikel.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 relative z-10">
                
                {/* Judul */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                  <label className={`block text-xs font-black uppercase tracking-widest ${textMuted} mb-2.5 ml-1 flex items-center gap-2`}>
                     <Type className="w-3.5 h-3.5 text-indigo-500" /> Judul Utama Berita
                  </label>
                  <input
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className={`w-full px-5 py-4 rounded-2xl border ${inputBgClass} ${inputBorderClass} ${textMain} ${placeholderClass} ${inputFocusClass} text-lg font-semibold shadow-sm transition-all`}
                    placeholder="Contoh: Gebyar Hardiknas 2024 Tingkat Kota Palu..."
                  />
                </div>

                {/* Kategori Berita (Custom Dropdown) */}
                <div className="col-span-1 md:col-span-1 lg:col-span-1" ref={kategoriRef}>
                   <label className={`block text-xs font-black uppercase tracking-widest ${textMuted} mb-2.5 ml-1 flex items-center gap-2`}>
                     <FolderTree className="w-3.5 h-3.5 text-blue-500" /> Kategori Publikasi
                   </label>
                   <div className="relative">
                     <div
                        onClick={() => setIsKategoriOpen(!isKategoriOpen)}
                        className={`w-full px-5 py-3.5 rounded-2xl border ${inputBgClass} ${isKategoriOpen ? (isLight ? "border-indigo-400 ring-4 ring-indigo-400/10" : "border-indigo-500 ring-4 ring-indigo-500/10") : (isLight ? "border-slate-200" : "border-slate-700/50")} ${kategori ? textMain : textMuted} text-sm font-medium shadow-sm transition-all cursor-pointer flex justify-between items-center select-none`}
                     >
                        <span className="truncate">{kategori || "Pilih kategori..."}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isKategoriOpen ? "rotate-180" : ""}`} />
                     </div>
                     
                     <AnimatePresence>
                        {isKategoriOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute z-50 w-full mt-2 rounded-2xl shadow-xl border overflow-hidden ${isLight ? "bg-white border-slate-200 shadow-indigo-500/10" : "bg-[#1e293b] border-slate-700 shadow-black/50"}`}
                          >
                            <div className="max-h-64 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
                              {kategoriOptions.map((opt, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    setKategori(opt);
                                    setIsKategoriOpen(false);
                                  }}
                                  className={`px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition-colors flex items-center justify-between group ${kategori === opt ? (isLight ? "bg-indigo-50 text-indigo-700" : "bg-indigo-500/20 text-indigo-400") : (isLight ? "text-slate-700 hover:bg-slate-50 hover:text-indigo-600" : "text-slate-300 hover:bg-slate-800 hover:text-indigo-400")}`}
                                >
                                  {opt}
                                  {kategori === opt && <Check className="w-4 h-4" />}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                     </AnimatePresence>
                   </div>
                </div>

                {/* Penulis */}
                <div className="col-span-1 md:col-span-1 lg:col-span-1">
                  <label className={`block text-xs font-black uppercase tracking-widest ${textMuted} mb-2.5 ml-1 flex items-center gap-1.5`}><User className="w-3.5 h-3.5 text-amber-500"/> Jurnalis</label>
                  <input
                    type="text"
                    value={penulis}
                    onChange={(e) => setPenulis(e.target.value)}
                    className={`w-full px-5 py-3.5 rounded-2xl border ${inputBgClass} ${inputBorderClass} ${textMain} ${placeholderClass} ${inputFocusClass} text-sm font-medium shadow-sm transition-all`}
                    placeholder="Nama Penulis"
                  />
                </div>

                {/* Tanggal Upload */}
                <div className="col-span-1 md:col-span-1 lg:col-span-1">
                   <label className={`block text-xs font-black uppercase tracking-widest ${textMuted} mb-2.5 ml-1 flex items-center gap-1.5`}><Calendar className="w-3.5 h-3.5 text-emerald-500"/> Jadwal Rilis</label>
                   <input
                    type="date"
                    value={jadwal}
                    onChange={(e) => setJadwal(e.target.value)}
                    className={`w-full px-5 py-3.5 rounded-2xl border ${inputBgClass} ${inputBorderClass} ${textMain} ${inputFocusClass} text-sm font-medium shadow-sm transition-all cursor-pointer`}
                    style={{colorScheme: isLight ? 'light' : 'dark'}}
                  />
                </div>

                {/* Hashtag */}
                <div className="col-span-1 md:col-span-1 lg:col-span-1">
                  <label className={`block text-xs font-black uppercase tracking-widest ${textMuted} mb-2.5 ml-1 flex items-center gap-1.5`}><Hash className="w-3.5 h-3.5 text-purple-500"/> Meta Tags</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={handleTagsChange}
                    className={`w-full px-5 py-3.5 rounded-2xl border ${inputBgClass} ${inputBorderClass} ${textMain} ${placeholderClass} ${inputFocusClass} text-sm font-medium shadow-sm transition-all`}
                    placeholder="#News, #Update"
                  />
                </div>

              </div>

          </div>

          {/* --- BOX 2 (BAWAH): EDITOR TEKS BERITA (LEBAR PENUH) --- */}
          <div className={`${cardBgClass} rounded-[2rem] shadow-sm border overflow-hidden flex flex-col transition-colors duration-300 w-full`}>
            
            {/* Header Editor */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30">
               <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                   <ImageIcon className="w-5 h-5" />
                 </div>
                 <div>
                   <h2 className={`text-lg font-bold ${textMain} tracking-tight`}>Konten Artikel</h2>
                 </div>
               </div>
               <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold tracking-wide uppercase">
                  <Star className="w-3.5 h-3.5" fill="currentColor" /> Gambar Pertama = Thumbnail
               </div>
            </div>
            
            <div className="h-[650px] w-full relative">
              {isMounted && (
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={isiBerita}
                  onChange={setIsiBerita}
                  modules={modules}
                  placeholder="Mulailah mengetik cerita yang luar biasa hari ini..."
                  className={`
                    h-full flex flex-col
                    
                    /* TOOLBAR MODERNIZATION */
                    [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:px-8 [&_.ql-toolbar]:py-4
                    ${isLight ? "[&_.ql-toolbar]:border-slate-200/80 [&_.ql-toolbar]:bg-white" : "[&_.ql-toolbar]:border-slate-700/50 [&_.ql-toolbar]:bg-[#131b2f]"}
                    ${!isLight && `
                        [&_.ql-toolbar_button_svg]:stroke-slate-400 hover:[&_.ql-toolbar_button_svg]:stroke-slate-200
                        [&_.ql-picker-label]:text-slate-400 hover:[&_.ql-picker-label]:text-slate-200
                        [&_.ql-stroke]:stroke-slate-400 hover:[&_.ql-stroke]:stroke-slate-200
                        [&_.ql-fill]:fill-slate-400 hover:[&_.ql-fill]:fill-slate-200
                    `}
                    
                    /* CONTAINER & SCROLL */
                    [&_.ql-container]:border-none [&_.ql-container]:flex-1 [&_.ql-container]:overflow-hidden
                    [&_.ql-editor]:h-full [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:px-12 [&_.ql-editor]:py-10
                    ${isLight ? "[&_.ql-editor]:text-slate-700 bg-white" : "[&_.ql-editor]:text-slate-200 bg-[#131b2f]"}
                    [&_.ql-editor]:text-[17px] [&_.ql-editor]:leading-loose
                    [&_.ql-editor.ql-blank::before]:text-slate-400 dark:[&_.ql-editor.ql-blank::before]:text-slate-500 [&_.ql-editor.ql-blank::before]:font-medium [&_.ql-editor.ql-blank::before]:italic
                    
                    /* CUSTOM SCROLLBAR */
                    [&_.ql-editor::-webkit-scrollbar]:w-2
                    [&_.ql-editor::-webkit-scrollbar-track]:bg-transparent
                    ${isLight 
                      ? "[&_.ql-editor::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&_.ql-editor::-webkit-scrollbar-thumb]:bg-slate-300" 
                      : "[&_.ql-editor::-webkit-scrollbar-thumb]:bg-slate-700 hover:[&_.ql-editor::-webkit-scrollbar-thumb]:bg-slate-600"
                    }
                    [&_.ql-editor::-webkit-scrollbar-thumb]:rounded-full
                  `}
                />
              )}
            </div>
          </div>

          <div className="flex justify-end w-full pt-2">
             <button
                type="button"
                onClick={submitBerita}
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-14 py-4 rounded-2xl font-bold text-lg shadow-[0_10px_25px_rgb(79,70,229,0.3)] flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-[0.98]"
             >
                <Save className="w-5 h-5" />
                {isEditMode ? "Update & Simpan Berita" : "Terbitkan Berita Sekarang"}
             </button>
          </div>

        </div>

        {/* =========================================
            BOX 3: DAFTAR BERITA (MUNCUL JIKA DITEKAN)
            ========================================= */}
        <AnimatePresence>
          {showList && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: 30 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: 30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full relative z-0 overflow-hidden pt-8"
            >
              <div className={`${cardBgClass} rounded-[2rem] shadow-sm border mb-4 overflow-hidden`}>
                
                {/* HEADER LIST */}
                <div className="flex flex-col md:flex-row justify-between items-center px-8 py-7 border-b border-slate-200/60 dark:border-slate-700/50 gap-5 bg-slate-50/30 dark:bg-slate-800/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                      <Layers className="w-6 h-6" /> 
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${textMain} tracking-tight`}>Arsip Publikasi</h2>
                      <p className="text-xs font-medium text-slate-500 mt-1">Kelola dan tinjau berita yang telah terbit.</p>
                    </div>
                  </div>
                  <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Search className="h-4 w-4" /></span>
                    <input 
                       type="text" 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder="Cari judul berita..." 
                       className={`w-full py-3.5 pl-12 pr-4 rounded-xl text-sm font-medium border focus:outline-none transition-all ${isLight ? "bg-white border-slate-200 text-slate-800 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 shadow-sm" : "bg-[#0f172a] border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"}`} 
                    />
                  </div>
                </div>

                {/* CONTENT LIST (GRID MODERN) */}
                <div className="p-6 md:p-8 min-h-[300px] bg-slate-50/20 dark:bg-transparent">
                  {filteredBerita.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-16">
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                         <Search className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-lg font-bold">Tidak Ada Data</p>
                      <p className="text-sm font-medium opacity-80 mt-1">Berita yang Anda cari tidak ditemukan.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      {currentBerita.map((berita) => {
                        const badge = getViewBadge(berita.views);
                        return (
                          <div key={berita.id} className={`group relative w-full flex flex-col sm:flex-row gap-5 p-5 pt-7 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isLight ? "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-indigo-500/10" : "bg-[#1c2438] border-slate-700/60 hover:border-indigo-500/50 hover:shadow-indigo-900/20"}`}>
                            
                            <div className={`absolute top-0 left-0 z-20 bg-gradient-to-br ${badge.className} text-white text-[10px] font-black uppercase px-4 py-2 rounded-tl-3xl rounded-br-2xl shadow-sm flex items-center gap-1.5`}>
                               <span className="text-xs">{badge.icon}</span> {badge.label}
                            </div>

                            {berita.kategori && (
                              <div className="absolute top-0 right-4 sm:right-6 flex flex-col items-center z-20 origin-top transform group-hover:rotate-1 transition-transform duration-300" title={berita.kategori}>
                                <div className="flex justify-between w-[70%] px-1">
                                  <div className="w-[2.5px] h-3.5 bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 shadow-sm rounded-b-full"></div>
                                  <div className="w-[2.5px] h-3.5 bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 shadow-sm rounded-b-full"></div>
                                </div>
                                <div className="bg-gradient-to-b from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-700 border-t border-indigo-400/50 shadow-md rounded-md px-3 py-1 flex items-center justify-center relative max-w-[150px]">
                                   <div className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-white/40"></div>
                                   <div className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-white/40"></div>
                                   <span className="block text-[8.5px] font-black text-white tracking-wider uppercase truncate text-center mt-0.5 w-full">
                                     {berita.kategori}
                                   </span>
                                </div>
                              </div>
                            )}

                            <div className="relative w-full sm:w-[150px] h-[150px] shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm mt-5">
                              <img
                                src={berita.gambar_url ? berita.gambar_url : extractFirstImage(berita.isi_berita) || "https://placehold.co/300x300"}
                                alt={berita.judul}
                                crossOrigin="anonymous" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x300"; }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            <div className="flex-1 flex flex-col min-w-0 py-1 pr-0 sm:pr-2 mt-2 sm:mt-5 h-auto sm:h-[150px]">
                              
                              <h3 className={`text-base font-bold ${textMain} leading-snug line-clamp-2 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pr-16`}>
                                {berita.judul}
                              </h3>
                              
                              <div className="mt-auto flex flex-col gap-3">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-slate-500">
                                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md"><Calendar className="w-3.5 h-3.5"/> {berita.tanggal_upload ? new Date(berita.tanggal_upload).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}</span>
                                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 opacity-80"/> <span className="truncate max-w-[80px]">{berita.penulis || "Admin"}</span></span>
                                  <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 opacity-80"/> {berita.views ? (berita.views / 1000).toFixed(1) + "K" : "0"} Views</span>
                                </div>

                                <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                                  <UploadToHighlight slug={berita.slug} onSuccess={handleRefresh}>
                                      <div className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isLight ? "bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700" : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"}`} title="Jadikan Sorotan Utama">
                                        <Star className="w-3.5 h-3.5" fill="currentColor" /> Sorotan
                                      </div>
                                  </UploadToHighlight>
                                  <div className="ml-auto flex gap-2">
                                    <button onClick={() => handleEdit(berita)} className={`p-2 rounded-xl transition-all ${isLight ? "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600" : "bg-[#0f172a] text-slate-400 hover:bg-blue-500/20 hover:text-blue-400"}`} title="Edit">
                                      <FileEdit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(berita.slug)} className={`p-2 rounded-xl transition-all ${isLight ? "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600" : "bg-[#0f172a] text-slate-400 hover:bg-rose-500/20 hover:text-rose-400"}`} title="Hapus">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* PAGINATION MODERN */}
                {totalPages > 1 && (
                  <div className={`px-8 py-6 border-t ${isLight ? "border-slate-200/60 bg-slate-50/50" : "border-slate-700/50 bg-[#131b2f]/80"} flex justify-center items-center space-x-2`}>
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${isLight ? "bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 shadow-sm" : "bg-[#1c2438] border border-slate-700 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50"} disabled:opacity-40`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = currentPage === pageNum;
                      return (
                        <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110" : (isLight ? "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-sm" : "bg-[#1c2438] text-slate-300 border border-slate-700 hover:bg-slate-800")}`}>
                          {pageNum}
                        </button>
                      );
                    })}
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${isLight ? "bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 shadow-sm" : "bg-[#1c2438] border border-slate-700 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50"} disabled:opacity-40`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}