import React, { useEffect, useState } from "react";
import FilePreview from "./FilePreview.tsx";

// --- KONFIGURASI API (DINAMIS) ---
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Kita butuh URL Root (misal: https://api.domain.com), bukan URL API (https://api.domain.com/api)
// Jadi kita hapus string "/api" dari akhir variabel environment
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, ""); 

// --- Interface Data ---
interface FileItem {
  name: string;
  url: string;
  previewUrl?: string;
}

interface LayananViewerProps {
  judul?: string;
  deskripsi?: string;
  endpoint: string;
}

export default function LayananViewer({
  judul,
  deskripsi,
  endpoint,
}: LayananViewerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Fungsi Build URL ---
  const buildPreviewUrl = (rawUrl: string): string => {
    try {
      const urlObj = new URL(rawUrl);
      const parts = urlObj.pathname.split("/").filter(Boolean);
      
      // Cek apakah url mengarah ke storage default
      if (parts.length < 4 || parts[0] !== "storage") return rawUrl;
      
      const folder = parts[1];
      const subfolder = parts[2];
      const filename = parts.slice(3).join("/");
      
      // ✅ GUNAKAN SERVER_BASE_URL (Dinamis)
      // Hasil: https://api.domain.com/preview/...
      return `${SERVER_BASE_URL}/preview/${folder}/${subfolder}/${filename}`;
    } catch {
      return rawUrl;
    }
  };

  // --- Fetch Data ---
  useEffect(() => {
    const fetchFiles = () => {
      // Pastikan endpoint yang dikirim dari Parent Component sudah full URL
      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => {
          if (data.files) {
            const mappedFiles = data.files.map((file: FileItem) => ({
              ...file,
              previewUrl: buildPreviewUrl(file.url),
            }));
            setFiles(mappedFiles);
          } else {
            setFiles([]);
          }
        })
        .catch(() => setFiles([]))
        .finally(() => setLoading(false));
    };

    fetchFiles();
  }, [endpoint]);

  const firstFileUrl = files.length > 0 ? files[0].previewUrl ?? "" : "";

  // --- RENDERING ---

  // 1. Loading State
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-500 animate-pulse">Memuat dokumen...</span>
        </div>
      </div>
    );
  }

  // 2. Empty State
  if (!loading && !firstFileUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 min-h-[400px] border-2 border-dashed border-slate-200 rounded-xl m-1">
        <div className="p-4 bg-white rounded-full shadow-sm mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
        </div>
        <p className="text-slate-500 font-medium">Tidak ada dokumen yang tersedia.</p>
      </div>
    );
  }

  // 3. Content State
  return (
    <div className="w-full h-full flex flex-col bg-white"> 
      {/* Container utama diberi bg-white agar menutup elemen di belakangnya */}

      {/* Header (Opsional) */}
      {(judul || deskripsi) && (
        <div className="mb-4 px-1">
          {judul && <h3 className="text-lg font-bold text-slate-800">{judul}</h3>}
          {deskripsi && <p className="text-sm text-slate-500 mt-1">{deskripsi}</p>}
        </div>
      )}

      {/* AREA PREVIEW WRAPPER */}
      {/* relative & z-0 untuk stacking context baru */}
      <div className="relative flex-1 w-full bg-white rounded-xl overflow-hidden border border-slate-200 shadow-inner group isolate">
        
        {/* Tombol Open New Tab (Yang diminta, style transparan/abu-abu saat hover) */}
        <div className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <a 
             href={firstFileUrl} 
             target="_blank" 
             rel="noreferrer" 
             className="flex items-center justify-center p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition"
             title="Buka di Tab Baru"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
           </a>
        </div>

        {/* Konten File */}
        <div className="relative z-10 w-full h-full bg-white"> 
          {/* bg-white di sini PENTING untuk menutupi background parent yang bocor */}
          
          {firstFileUrl.toLowerCase().endsWith(".pdf") ? (
            // Mode PDF
            <div className="w-full h-full min-h-[500px]">
              <FilePreview fileUrl={firstFileUrl} />
            </div>
          ) : (
            // Mode Gambar
            <div className="w-full h-full flex items-center justify-center bg-slate-100 min-h-[400px]">
               {/* Pattern background halus untuk gambar transparan */}
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
               
               <img
                src={firstFileUrl}
                alt="Preview Dokumen"
                className="relative z-20 max-w-full max-h-full object-contain shadow-lg"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}