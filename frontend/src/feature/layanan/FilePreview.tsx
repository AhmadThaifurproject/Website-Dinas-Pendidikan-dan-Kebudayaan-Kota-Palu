import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

// --- STYLES WAJIB REACT-PDF ---
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Setup Worker (Wajib)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FilePreviewProps {
  fileUrl: string;
}

export default function FilePreview({ fileUrl }: FilePreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    // 1. CONTAINER UTAMA (FRAME LUAR)
    // 'isolate' membuat stacking context baru agar z-index aman
    // 'relative' menjadi patokan ukuran untuk child di dalamnya
    <div className="relative w-full h-full min-h-[500px] bg-slate-100 rounded-xl shadow-lg group isolate overflow-hidden">
      
      {/* 2. LAYER SCROLLING (FRAME DALAM) - KUNCI PERBAIKANNYA DISINI */}
      {/* 'absolute inset-0': Memaksa div ini menempel ke 4 sisi container utama. 
          Div ini TIDAK AKAN melebar keluar meskipun isinya (PDF) di-zoom raksasa.
          'overflow-auto': Scrollbar muncul DI DALAM frame ini.
          'overscroll-contain': Mencegah scroll bocor ke body browser. */}
      <div className="absolute inset-0 overflow-auto flex justify-center p-8 custom-scrollbar overscroll-contain">
        <Document 
            file={fileUrl} 
            onLoadSuccess={onDocumentLoadSuccess} 
            className="shadow-2xl"
            loading={
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
                    <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-sm">Memuat PDF...</span>
                </div>
            }
            error={
                <div className="text-rose-500 bg-rose-50 px-4 py-2 rounded-lg text-sm">
                    Gagal memuat dokumen.
                </div>
            }
        >
           <Page 
             pageNumber={pageNumber} 
             scale={scale} 
             renderTextLayer={false} 
             renderAnnotationLayer={false}
             className="bg-white" 
           />
        </Document>
      </div>

      {/* 3. ELEMEN FLOATING (HEADER & TOOLBAR) */}
      {/* Karena area scroll sekarang 'absolute', elemen floating ini tetap aman di atasnya (z-20) */}

      {/* HEADER TOMBOL POP-OUT */}
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center justify-center p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm transition"
          title="Buka di Tab Baru"
        >
          <ExternalLink size={20} />
        </a>
      </div>

      {/* TOOLBAR MELAYANG */}
      {numPages && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <div className="flex items-center gap-4 px-6 py-3 bg-[#1a1a1a]/90 text-white rounded-full shadow-2xl backdrop-blur-md transition-transform duration-300 hover:scale-105">
            
            {/* Navigasi Halaman */}
            <div className="flex items-center gap-2 border-r border-white/20 pr-4">
                <button 
                    disabled={pageNumber <= 1} 
                    onClick={() => setPageNumber(p => p - 1)} 
                    className="hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft size={18} />
                </button>
                
                <span className="text-sm font-medium whitespace-nowrap min-w-[80px] text-center">
                    Halaman {pageNumber} / {numPages ?? '--'}
                </span>
                
                <button 
                    disabled={pageNumber >= (numPages ?? 1)} 
                    onClick={() => setPageNumber(p => p + 1)} 
                    className="hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-3 pl-1">
                <button 
                    onClick={() => setScale(s => Math.max(0.5, s - 0.1))} 
                    className="hover:text-blue-400 transition"
                    title="Zoom Out"
                >
                    <ZoomOut size={18} />
                </button>
                
                <span className="text-xs font-mono w-10 text-center">
                    {Math.round(scale * 100)}%
                </span>
                
                <button 
                    onClick={() => setScale(s => Math.min(2.0, s + 0.1))} 
                    className="hover:text-blue-400 transition"
                    title="Zoom In"
                >
                    <ZoomIn size={18} />
                </button>
            </div>

            </div>
        </div>
      )}

    </div>
  );
}