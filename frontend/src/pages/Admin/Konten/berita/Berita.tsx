// src/pages/Admin/FormBerita.tsx (Contoh Path)
import React, { useState, useEffect, useCallback, ChangeEvent, useContext,  useRef } from "react";
import { useMemo } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import "react-quill/dist/quill.snow.css";
import ReactQuill from 'react-quill';
import { saveAs } from "file-saver";
import DOMPurify from 'dompurify';
import { extractFirstImage } from "../../../../utils/helper"; // Sesuaikan path utils Anda
import UploadToHighlight from "../../../../feature/highlight/UploadToHighlight"; // Sesuaikan path component
import { getViewBadge } from "../../../../components/Helper/viewBadge"; // Sesuaikan path helper
import { Document, Packer, Paragraph, TextRun } from "docx";
import { 
  User, Calendar, Hash, Image as ImageIcon, 
  Search, Filter // Menambahkan icon yang sebelumnya SVG manual
} from 'lucide-react';

// --- IMPORT THEME CONTEXT (Sesuai Referensi) ---
import { ThemeContextAdmin } from "../../components/theme/ThemeContextAdmin"; 

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

  // Refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sidebar state
  const [jadwal, setJadwal] = useState("");
  const [kategori, setKategori] = useState("");
  const [tags, setTags] = useState("");

  const [isMounted, setIsMounted] = useState(false);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- STYLE HELPERS (DARK/LIGHT MODE CONFIG) ---
  // Kita definisikan class dinamis di sini agar JSX di bawah tidak berantakan penuh ternary operator
  const mainContainerClass = isLight ? "bg-[#F8F9FA]" : "bg-gray-900";
  const cardBgClass = isLight ? "bg-white border-gray-100" : "bg-gray-800 border-gray-700";
  const textMain = isLight ? "text-gray-700" : "text-gray-200";
  const textMuted = isLight ? "text-gray-500" : "text-gray-400";
  const placeholderClass = isLight ? "placeholder-gray-300" : "placeholder-gray-600";
  const borderClass = isLight ? "bg-gray-300" : "bg-gray-600"; // Untuk divider garis
  const inputBgClass = "bg-transparent"; // Input tetap transparan, warna text mengikuti parent

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

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("http://localhost:8000/api/berita/upload-editor-image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection(true);
          if (quill) {
             const index = range ? range.index : quill.getLength();
             quill.insertEmbed(index, "image", data.url);
          }
        }
      } catch (err) {
        console.error("Gagal upload gambar:", err);
      }
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
      handlers: {
        image: handleImageUpload, 
      },
    },
  }), [handleImageUpload]);

  // Tags Formatting
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
    if (token.length > 0) {
      parts.push({ text: token.trim(), completed: false });
    }
    let out = "";
    for (let idx = 0; idx < parts.length; idx++) {
      const p = parts[idx];
      if (p.completed) {
        if (p.text) {
          out += (p.text.startsWith("#") ? p.text : `#${p.text}`);
        }
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

  // Fetch Logic
  const fetchBerita = () => {
    fetch("http://localhost:8000/api/berita", { mode: "cors" })
      .then((res) => res.json())
      .then((data: Berita[]) => {
        const sorted = data.sort((a, b) => {
          const tA = new Date(a.tanggal_upload).getTime();
          const tB = new Date(b.tanggal_upload).getTime();
          return tB - tA; 
        });
        setListBerita(sorted);
      })
      .catch((err) => console.error("Gagal ambil data berita:", err));
  };

  useEffect(() => {
    fetchBerita();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  function resetForm() {
    setJudul("");
    setIsiBerita("");
    setPenulis("");
    setGambar(null);
    setIsEditMode(false);
    setEditSlug(null);
    setTanggalUpload(getNowLocalDate());
    setTags("");
    setKategori("");
    setJadwal("");
  }

  function getNowLocalDate() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  async function submitBerita(e?: React.FormEvent) {
    if (e) e.preventDefault(); 
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi_berita", isiBerita);
    formData.append("penulis", penulis);
    formData.append("kategori", kategori);
    if (jadwal) formData.append("tanggal_upload", jadwal);

    if (gambar) {
      formData.append("gambar", gambar);
    } else {
      const imageFromEditor = extractFirstImageSrc(isiBerita);
      if (imageFromEditor) formData.append("gambar_url", imageFromEditor);
    }

    const tagArray = typeof tags === 'string' 
      ? tags.split(",").map((t) => t.trim().replace('#', '')).filter(Boolean)
      : []; 
    if (tagArray.length > 0) {
      tagArray.forEach((t, index) => formData.append(`tags[${index}]`, t));
    }

    let url = "http://localhost:8000/api/berita";
    let method = "POST";

    if (isEditMode && editSlug) {
      url = `http://localhost:8000/api/berita/${editSlug}`;
      formData.append("_method", "PUT"); 
    }

    try {
      const res = await fetch(url, {
        method: method,
        body: formData,
        headers: { "Accept": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengunggah berita");

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Berita Diperbarui!" : "Berita Ditambahkan!",
        timer: 1500,
        showConfirmButton: false,
      });

      handleRefresh();
      if (!isEditMode) {
        const itemsPerPage = 3; 
        setCurrentPage(Math.ceil((listBerita.length + 1) / itemsPerPage));
      }
      resetForm();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Gagal!", text: err.message });
    }
  }

  function handleEdit(berita: Berita) {
    setIsEditMode(true);
    setEditSlug(berita.slug);
    setJudul(berita.judul);
    setIsiBerita(berita.isi_berita);
    setPenulis(berita.penulis);
    setGambar(null);
    setTanggalUpload(berita.tanggal_upload ? berita.tanggal_upload.slice(0, 10) : getNowLocalDate());
    setTags(berita.tags ? berita.tags.join(", ") : "");
    setJadwal(berita.jadwal ?? "");
    setKategori(berita.kategori ?? "");
  }

  function handleDelete(slug: string) {
    Swal.fire({
      title: "Yakin ingin menghapus?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8000/api/berita/${slug}`, { method: "DELETE" })
          .then((res) => {
            if (res.ok) {
              Swal.fire({ icon: "success", title: "Berita dihapus!", timer: 1500, showConfirmButton: false });
              handleRefresh();
            } else {
              Swal.fire({ icon: "error", title: "Gagal menghapus!" });
            }
          });
      }
    });
  }

  // --- PAGINATION LOGIC ---
  const itemsPerPage = 3;
  const sortedBerita = [...listBerita].sort((a, b) => {
    const ta = a.tanggal_upload ? new Date(a.tanggal_upload).getTime() : 0;
    const tb = b.tanggal_upload ? new Date(b.tanggal_upload).getTime() : 0;
    return tb - ta; // Terbaru ke terlama
  });
  const totalPages = Math.ceil(sortedBerita.length / itemsPerPage);
  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  const currentBerita = sortedBerita.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>   
      {/* --- MAIN CARD WRAPPER --- */}
      <div className={`${mainContainerClass} w-full max-w-[85rem] rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row p-8 gap-8 relative transition-colors duration-300`}>

        {/* ===== BAGIAN KIRI: INPUT FIELDS (±35%) ===== */}
        <div className="w-full lg:w-[35%] flex flex-col pt-2">

          {/* 1. INPUT JUDUL */}
          <div className="relative pb-2 group">
            <div className="flex items-center gap-4 mb-2">
              <div className={textMuted}>
                {/* SVG diganti dengan Icon Lucide agar lebih bersih (opsional) atau tetap SVG dengan class textMuted */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
              </div>
              <div className={`w-[1px] h-8 ${borderClass}`}></div>
              <div className="flex-1 flex flex-col">
                <label className={`text-sm ${textMuted} font-medium mb-0.5`}>Judul</label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className={`w-full ${inputBgClass} border-none outline-none p-0 ${textMain} font-medium ${placeholderClass} focus:ring-0 text-base transition-colors`}
                  placeholder="Ketik judul berita utama..."
                />
              </div>
            </div>
            <div className={`relative w-full h-[1px] ${borderClass} mt-1`}><div className="absolute left-0 top-[-1px] h-[4px] w-full bg-[#C4C4C4] rounded-tr-lg"></div></div>
          </div>

          <div className={`border-b ${isLight ? 'border-gray-100' : 'border-gray-700'} my-6`}></div>

          {/* 2. PENULIS & TANGGAL */}
          <div className="flex items-start gap-6">
            
            {/* Bagian Penulis */}
            <div className="relative w-[60%] group">
              <div className="flex items-center gap-3 mb-2">
                <User className={`w-6 h-6 ${textMuted} stroke-[1.5]`} />
                <div className={`w-[1px] h-8 ${borderClass}`}></div>
                <div className="flex-1 flex flex-col">
                    <label className={`text-sm ${textMuted} font-medium mb-0.5`}>Penulis</label>
                    <input type="text" value={penulis} onChange={(e) => setPenulis(e.target.value)} className={`w-full ${inputBgClass} border-none outline-none p-0 ${textMain} font-medium ${placeholderClass} focus:ring-0 text-base`} placeholder="Nama penulis" />
                </div>
              </div>
              {/* Container garis utama */}
              <div className={`relative w-full h-[1px] ${borderClass} mt-1`}>
                 {/* Garis tebal di atas, w-full agar menempel sampai ujung kanan (pembatas) */}
                 <div className="absolute left-0 top-[-1px] h-[4px] w-full bg-[#C4C4C4] rounded-tr-sm"></div>
              </div>
            </div>

            {/* Pembatas Tengah */}
            <div className={`w-[1px] h-16 ${isLight ? 'bg-gray-200' : 'bg-gray-700'} mx-2`}></div>
            
            {/* Bagian Tanggal */}
            <div className="relative w-[40%] group pl-0">
              <div className="flex items-center gap-3 mb-2">
                <div className={`${textMuted} shrink-0`}><Calendar className="w-6 h-6 stroke-[1.5]" /></div>
                <div className={`w-[1px] h-8 ${borderClass}`}></div>
                <div className="flex-1 flex flex-col">
                    <label className={`text-sm ${textMuted} font-medium mb-0.5`}>Tanggal</label>
                    <input type="date" value={jadwal} onChange={(e) => setJadwal(e.target.value)} className={`w-full ${inputBgClass} border-none outline-none p-0 ${textMain} font-medium ${placeholderClass} focus:ring-0 text-base`} style={{colorScheme: isLight ? 'light' : 'dark'}} />
                </div>
              </div>
               <div className={`relative w-full h-[1px] ${borderClass} mt-1`}>
                 {/* Menggunakan w-full agar responsif */}
                 <div className="absolute left-0 top-[-1px] h-[4px] w-full bg-[#C4C4C4] rounded-tr-sm"></div>
               </div>
            </div>
          </div>

          <div className={`border-b ${isLight ? 'border-gray-100' : 'border-gray-700'} my-6`}></div>

          {/* 3. KATEGORI */}
          <div className="relative pb-2 group">
            <div className="flex items-center gap-4 mb-2">
              <div className={textMuted}><Filter className="w-6 h-6" strokeWidth={1.5}/></div>
              <div className="flex-1 flex flex-col relative">
                <label className={`text-sm ${textMuted} font-medium mb-0.5`}>Kategori</label>
                
                <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    // Perbaikan: Pastikan warna teks select menyesuaikan state (terpilih vs placeholder)
                    className={`w-full ${inputBgClass} border-none outline-none p-0 font-medium focus:ring-0 appearance-none cursor-pointer text-base pb-1 ${kategori ? textMain : (isLight ? "text-gray-400" : "text-gray-500")}`}
                  >
                    {/* Perbaikan: Gunakan style dinamis untuk option agar background & text berubah sesuai tema */}
                    {(() => {
                      const optionClass = isLight 
                        ? "bg-white text-gray-800" 
                        : "bg-gray-800 text-gray-200"; // Mode Dark: Background Gelap, Teks Terang
                      
                      return (
                        <>
                          <option value="" disabled hidden>Pilih Kategori Layanan...</option>
                          <option value="PAUD Dan PNF" className={optionClass}>PAUD Dan PNF</option>
                          <option value="SD" className={optionClass}>SD</option>
                          <option value="SMP" className={optionClass}>SMP</option>
                          <option value="Ketenagaan GTK" className={optionClass}>Ketenagaan GTK</option>
                          <option value="Sub-Bagian Umum dan Kepegawaian" className={optionClass}>Sub-Bagian Umum dan Kepegawaian</option>
                          <option value="Kebudayaan" className={optionClass}>Kebudayaan</option>
                          <option value="Perencanaan Dan Program" className={optionClass}>Perencanaan Dan Program</option>
                          <option value="Sub-Sekretariat" className={optionClass}>Sub-Sekretariat</option>
                          <option value="Aset dan Keuangan" className={optionClass}>Aset dan Keuangan</option>
                          <option value="Pengaduan Masyarakat" className={optionClass}>Pengaduan Masyarakat</option>
                        </>
                      );
                    })()}
                  </select>
                  
                <div className={`absolute right-0 bottom-2 pointer-events-none ${textMuted}`}><svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
              </div>
            </div>
            <div className={`relative w-full h-[1px] ${borderClass} mt-1`}><div className="absolute left-0 top-[-1px] h-[4px] w-full bg-[#C4C4C4] rounded-tr-lg"></div></div>
          </div>

          <div className={`border-b ${isLight ? 'border-gray-100' : 'border-gray-700'} my-6`}></div>

          {/* 4. HASHTAG */}
          <div className="relative pb-2 group">
             <div className="flex items-center gap-5 mb-3">
               <div className={textMuted}><Hash className="w-7 h-7 stroke-[1.5]" /></div>
               <div className={`w-[1px] h-10 ${borderClass}`}></div>
               <div className="flex-1 flex flex-col gap-1">
                 <label className={`text-sm ${textMuted} font-bold tracking-wide uppercase`}>Hashtag</label> 
                 <div className="flex flex-wrap items-center gap-2">
                    <div className={`${isLight ? "bg-gray-100 text-gray-500" : "bg-gray-700 text-gray-300"} px-2 py-0.5 rounded-md text-sm font-medium`}>#news</div>
                    <div className="flex-1 min-w-[50px]"><input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={`w-full ${inputBgClass} border-none outline-none p-0 ${textMain} font-medium ${placeholderClass} focus:ring-0 text-base py-0.5`} placeholder="Tambah tag..." autoFocus={false} /></div>
                 </div>
               </div>
             </div>
             <div className={`relative w-full h-[1px] ${borderClass} mt-1`}><div className="absolute left-0 top-[-1px] h-[4px] w-full bg-[#C4C4C4] rounded-tr-lg"></div></div>
          </div>

          {/* TOMBOL SUBMIT */}
          <div className="mt-12 flex items-center justify-center pb-4">
            <div className="flex items-center gap-2 mr-4">
               <div className={`w-12 h-[2px] rounded-full ${isLight ? "bg-gray-300/40" : "bg-gray-600/40"}`}></div>
               <div className={`w-2 h-[2px] rounded-full ${isLight ? "bg-gray-300/40" : "bg-gray-600/40"}`}></div>
            </div>
            <button
            type="button"
            onClick={submitBerita}
            className="bg-[#5B7CB8] hover:bg-[#4a6598] text-white px-10 py-3 rounded-full font-medium shadow-lg shadow-blue-200/50 transition-all hover:scale-105 active:scale-95"
            >
              Submit
            </button>
            <div className="flex items-center gap-2 ml-4">
               <div className={`w-2 h-[2px] rounded-full ${isLight ? "bg-gray-300/40" : "bg-gray-600/40"}`}></div>
               <div className={`w-12 h-[2px] rounded-full ${isLight ? "bg-gray-300/40" : "bg-gray-600/40"}`}></div>
            </div>
          </div>
        </div>

        {/* ===== BAGIAN KANAN: EDITOR (±65%) ===== */}
        <div className="w-full lg:w-[65%] flex flex-col gap-8 lg:pl-12">
          {/* CARD EDITOR */}
          <div className={`${cardBgClass} rounded-[30px] shadow-sm flex flex-col h-[600px] border overflow-hidden relative transition-colors duration-300`}>
            {isMounted && (
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={isiBerita}
                onChange={setIsiBerita}
                modules={modules}
                placeholder="Ketik isi berita di sini..."
                className={`
                  flex flex-col h-full
                  /* STYLING TOOLBAR REACT QUILL AGAR RESPONSIVE TEMA */
                  [&_.ql-toolbar]:border-none
                  [&_.ql-toolbar]:border-b 
                  ${isLight ? "[&_.ql-toolbar]:border-gray-100" : "[&_.ql-toolbar]:border-gray-700"}
                  [&_.ql-toolbar]:px-8 
                  [&_.ql-toolbar]:py-4
                  ${isLight ? "[&_.ql-toolbar]:bg-white" : "[&_.ql-toolbar]:bg-gray-800"}
                  
                  /* Ubah warna icon toolbar saat dark mode */
                  ${!isLight && `
                      [&_.ql-toolbar_button_svg]:stroke-gray-300
                      [&_.ql-picker-label]:text-gray-300
                      [&_.ql-stroke]:stroke-gray-300
                      [&_.ql-fill]:fill-gray-300
                  `}

                  /* STYLING CONTAINER */
                  [&_.ql-container]:border-none
                  [&_.ql-container]:flex-1
                  [&_.ql-container]:overflow-hidden
                  
                  /* STYLING EDITOR TEXT */
                  [&_.ql-editor]:h-full
                  [&_.ql-editor]:overflow-y-auto
                  [&_.ql-editor]:px-8
                  [&_.ql-editor]:py-6
                  ${isLight ? "[&_.ql-editor]:text-gray-600" : "[&_.ql-editor]:text-gray-200"}
                  [&_.ql-editor]:text-lg 
                  [&_.ql-editor.ql-blank::before]:text-gray-400
                  [&_.ql-editor.ql-blank::before]:font-normal

                  /* SCROLLBAR */
                  [&_.ql-editor::-webkit-scrollbar]:w-2
                  [&_.ql-editor::-webkit-scrollbar-track]:bg-transparent
                  ${isLight 
                    ? "[&_.ql-editor::-webkit-scrollbar-thumb]:bg-gray-200" 
                    : "[&_.ql-editor::-webkit-scrollbar-thumb]:bg-gray-600"
                  }
                  [&_.ql-editor::-webkit-scrollbar-thumb]:rounded-full
                `}
              />
            )}
          </div>
        </div>
      </div>

      {/* ===== LIST BERITA SECTION ===== */}
      <div className="mt-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowList((prev) => !prev)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            {showList ? "Sembunyikan List Berita" : "Tampilkan List Berita"}
          </button>
        </div>

        <AnimatePresence>
          {showList && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full relative z-0"
            >
              <div className={`${cardBgClass} rounded-[24px] shadow-xl border overflow-hidden transition-colors duration-300`}>
                
                {/* HEADER LIST */}
                <div className="flex flex-col md:flex-row justify-between items-center px-8 py-6 gap-4">
                  <h2 className={`text-2xl font-bold ${isLight ? "text-black" : "text-white"} tracking-tight w-full md:w-auto text-left`}>
                    Berita Terupload
                  </h2>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Search className="h-5 w-5" />
                      </span>
                      <input
                        type="text"
                        placeholder="" 
                        className={`w-full py-2 pl-10 pr-4 ${isLight ? "bg-gray-50 border-gray-300 text-gray-900" : "bg-gray-700 border-gray-600 text-white"} border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors`}
                      />
                    </div>
                    <button className={`${textMuted} hover:text-gray-700`}>
                        <Filter className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className={`h-[1px] ${isLight ? 'bg-gray-100' : 'bg-gray-700'} mx-6 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]`}></div>

                {/* CONTENT AREA */}
                <div className="px-4 py-6 min-h-[400px]">
                  {listBerita.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20 space-y-2">
                      <p className="text-lg font-medium">Empty Content Zone</p>
                      <p className="text-sm">for news cards / list per page</p>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-8">
                      {currentBerita.map((berita, index) => {
                        const badge = getViewBadge(berita.views);
                        return (
                          <div key={berita.id} className="relative group w-full">
                            {/* BADGE */}
                            <div className={`absolute -top-4 right-12 z-20 bg-gradient-to-r ${badge.className} text-white text-[11px] font-bold px-5 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-110`}>
                              <span className="text-sm">{badge.icon}</span>
                              <span className="tracking-wide">{badge.label}</span>
                            </div>

                            {/* CARD BERITA */}
                            <div className={`relative ${isLight ? "bg-[#fdfbf7]/90 border-white/60 hover:bg-[#fffdf5]/95" : "bg-gray-800/90 border-gray-700/60 hover:bg-gray-800/95"} backdrop-blur-xl border shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[50px] p-6 flex flex-col md:flex-row items-start gap-8 transition-all duration-300`}>
                              
                              {/* GAMBAR */}
                              <div className="relative w-full md:w-[260px] h-[260px] shrink-0">
                                <div className="w-full h-full rounded-[35px] overflow-hidden shadow-sm relative group-hover:scale-[1.02] transition-transform duration-500">
                                  <img
                                    src={berita.gambar_url ? berita.gambar_url : extractFirstImage(berita.isi_berita) || "https://placehold.co/300x300"}
                                    alt={berita.judul}
                                    className="w-full h-full object-cover bg-gray-200"
                                  />
                                  <div className="absolute bottom-0 left-0 w-fit pr-8 bg-white/40 backdrop-blur-md border-t border-r border-white/50 rounded-tr-[30px] p-5">
                                     <div className="flex flex-col text-xs font-semibold text-gray-800 space-y-1">
                                        <span className="text-gray-800">#Innovation</span>
                                        <span className="text-gray-700">#Edukasi</span>
                                     </div>
                                  </div>
                                </div>
                              </div>

                              {/* KONTEN TENGAH */}
                              <div className="flex-1 w-full relative flex flex-col h-full md:h-[260px]">
                                {berita.kategori && (
                                  <span className="inline-block bg-[#38bdf8] text-white text-xs font-bold px-6 py-2 rounded-full shadow-md shadow-blue-200/50 tracking-wide uppercase absolute top-0 left-0">
                                    {berita.kategori}
                                  </span>
                                )}

                                <h3 className={`mt-[80px] text-3xl font-black ${isLight ? "text-gray-800" : "text-gray-100"} leading-tight tracking-tight line-clamp-3`}>
                                  {berita.judul}
                                </h3>

                                <div className="absolute bottom-0 left-0 w-full flex flex-col space-y-3 pb-1">
                                  <div className={`w-full h-[1px] ${isLight ? "bg-gray-300/50" : "bg-gray-600/50"}`}></div>
                                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-400 text-sm font-medium">
                                    
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-5 w-5 opacity-70" />
                                      <span className="tracking-wide whitespace-nowrap">
                                        {berita.tanggal_upload ? new Date(berita.tanggal_upload).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                                      </span>
                                    </div>
                                    <div className={`h-4 w-[1px] ${isLight ? "bg-gray-300" : "bg-gray-600"}`}></div>
                                    
                                    <div className="flex items-center gap-2">
                                       {/* Icon Eye */}
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                      <span className="tracking-wide">
                                        {berita.views ? (berita.views / 1000).toFixed(1) + "K" : "0"}
                                      </span>
                                    </div>
                                    <div className={`h-4 w-[1px] ${isLight ? "bg-gray-300" : "bg-gray-600"}`}></div>

                                    <div className="flex items-center gap-2">
                                      <User className="h-5 w-5 opacity-70" />
                                      <span className="tracking-wide truncate max-w-[100px] md:max-w-none">
                                         {berita.penulis || "Admin"}
                                      </span>
                                    </div>

                                  </div>
                                </div>
                              </div>

                              <div className={`hidden md:block w-[1px] h-[200px] self-center ${isLight ? "bg-gray-300/50" : "bg-gray-600/50"}`}></div>

                              {/* TOMBOL AKSI */}
                              <div className="flex flex-row md:flex-col items-center gap-4 shrink-0 self-center">
                                <div className="relative group/star">
                                   <UploadToHighlight slug={berita.slug} onSuccess={handleRefresh}>
                                      <div className={`w-12 h-12 rounded-full ${isLight ? "bg-[#dffbf8] border-[#a5f3fc] text-gray-600" : "bg-teal-900 border-teal-700 text-teal-200"} border-2 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200`}>
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                      </div>
                                   </UploadToHighlight>
                                </div>

                                <button onClick={() => handleEdit(berita)} className={`w-12 h-12 rounded-full border ${isLight ? "border-gray-300 text-gray-500 hover:bg-gray-100" : "border-gray-600 text-gray-400 hover:bg-gray-700"} bg-transparent flex items-center justify-center transition duration-200`} title="Edit">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>

                                <button onClick={() => handleDelete(berita.slug)} className={`w-12 h-12 rounded-full border ${isLight ? "border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-300" : "border-gray-600 text-gray-400 hover:bg-red-900/30 hover:text-red-400 hover:border-red-800"} bg-transparent flex items-center justify-center transition duration-200`} title="Hapus">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* PAGINATION */}
                <div className={`h-[1px] ${isLight ? 'bg-gray-100' : 'bg-gray-700'} mx-6 mt-6`}></div>
                {totalPages > 1 && (
                  <div className="py-8 flex justify-center items-center space-x-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className={`w-10 h-10 flex items-center justify-center rounded-xl ${isLight ? "bg-white border-gray-200 text-gray-400 hover:text-[#64b5ac] hover:border-[#64b5ac]" : "bg-gray-800 border-gray-700 text-gray-500 hover:text-[#64b5ac] hover:border-[#64b5ac]"} border disabled:opacity-30 transition-all duration-200`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = currentPage === pageNum;
                      return (
                        <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${isActive ? "bg-[#64b5ac] text-white shadow-[#64b5ac]/40 shadow-lg transform scale-105" : (isLight ? "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-[#64b5ac]" : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-[#64b5ac]")}`}>
                          {pageNum}
                        </button>
                      );
                    })}

                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className={`w-10 h-10 flex items-center justify-center rounded-xl ${isLight ? "bg-white border-gray-200 text-gray-400 hover:text-[#64b5ac] hover:border-[#64b5ac]" : "bg-gray-800 border-gray-700 text-gray-500 hover:text-[#64b5ac] hover:border-[#64b5ac]"} border disabled:opacity-30 transition-all duration-200`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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