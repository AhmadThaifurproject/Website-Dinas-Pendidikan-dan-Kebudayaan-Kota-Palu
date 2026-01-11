import React, { useState, ReactNode, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { TrendingUp, Clock, UploadCloud, ChevronRight, Sparkles, X } from "lucide-react";
import { createPortal } from "react-dom";

interface Props {
  slug: string;
  children: ReactNode;
  onSuccess?: () => void;
}

const UploadToHighlight: React.FC<Props> = ({ slug, children, onSuccess }) => {
  const [kategori, setKategori] = useState<"sorotan" | "terbaru" | "">("");
  const [showForm, setShowForm] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Ref untuk klik di luar modal (Close on click outside)
  const modalRef = useRef<HTMLDivElement>(null);

  const categoryOptions = [
    {
      id: "sorotan",
      label: "Jadikan Sorotan Berita",
      description: "Tampilkan di posisi utama untuk visibilitas maksimal.",
      icon: TrendingUp, 
    },
    {
      id: "terbaru",
      label: "Post sebagai Berita Terbaru",
      description: "Terbitkan secara kronologis di umpan berita.",
      icon: Clock,
    },
  ];

  // Logic Klik di Luar Modal untuk Close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
      // Kunci scroll body saat modal terbuka agar tidak goyang
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showForm]);

  // Reset kategori saat form ditutup
  useEffect(() => {
    if (!showForm) setKategori("");
  }, [showForm]);

  const handleUpload = async () => {
    if (!kategori) {
      const btn = document.getElementById('upload-btn');
      btn?.classList.add('animate-shake');
      setTimeout(() => btn?.classList.remove('animate-shake'), 500);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("slug", slug);

      // Logic Highlight
      const isHighlight = kategori === "sorotan" ? "1" : "0";
      formData.append("highlight", isHighlight); 

      Swal.showLoading();
      
      const uploadRes = await fetch("http://localhost:8000/api/berita/set-highlight", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
        credentials: "include",
      });

      if (uploadRes.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: kategori === 'sorotan' ? 'Berita dijadikan Sorotan Utama.' : 'Berita diposting sebagai Terbaru.',
            confirmButtonColor: '#0ea5e9',
            timer: 2000,
            showConfirmButton: false
        });
        
        setKategori("");
        setShowForm(false);

        // Refresh Data Parent
        if (onSuccess) {
            onSuccess();
        }

      } else {
        Swal.fire("Gagal", "Terjadi kesalahan saat upload", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Koneksi bermasalah", "error");
    }
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <div 
        onClick={() => setShowForm(true)} 
        className="cursor-pointer inline-block relative transition-transform active:scale-95"
      >
        {children}
      </div>

      {/* MODAL PORTAL */}
      {showForm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* BACKDROP (Latar Gelap) */}
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200"></div>

          {/* MAIN MODAL CONTENT */}
          <div 
            ref={modalRef}
            className="relative w-full max-w-md bg-[#f0f9ff] rounded-[2.5rem] shadow-2xl border border-sky-100 ring-1 ring-white/50 animate-in zoom-in-95 fade-in duration-300 overflow-hidden font-sans"
          >
            {/* Tombol Close Pojok Kanan Atas */}
            <button 
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/50 hover:bg-white text-slate-400 hover:text-red-500 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            {/* --- DEKORASI HEADER --- */}
            <div className="absolute top-0 left-0 w-full h-40 overflow-hidden pointer-events-none">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
                  <path d="M0,20 C30,5 70,45 100,25" fill="none" stroke="#7dd3fc" strokeWidth="3" className="opacity-60" />
                  <path d="M0,28 C40,10 60,50 100,20" fill="none" stroke="#0ea5e9" strokeWidth="4" className="opacity-40" />
                </svg>
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-300 blur-[60px] opacity-30 rounded-full"></div>
            </div>

            {/* --- HEADER TEXT --- */}
            <div className="px-6 pt-12 pb-4 relative text-center z-10">
              <h4 className="text-xl tracking-wide text-slate-600 uppercase font-light">
                Konfirmasi <span className="text-sky-700 font-black">Unggahan</span>
              </h4>
              <p className="text-[13px] text-slate-500 mt-2 px-6 font-medium leading-relaxed">
                Pilih prioritas tampilan berita di halaman utama.
              </p>
            </div>

            {/* --- PILIHAN KARTU --- */}
            <div className="px-5 py-2 flex flex-col gap-4 relative z-10">
              {categoryOptions.map((option) => {
                const isSelected = kategori === option.id;
                const Icon = option.icon;
                const isHovered = hoveredId === option.id;

                return (
                  <div
                    key={option.id}
                    onMouseEnter={() => setHoveredId(option.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setKategori(option.id as any)}
                    className={`
                      group relative flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all duration-300 border-2 overflow-hidden
                      ${isSelected 
                        ? 'border-sky-500 bg-gradient-to-br from-white to-sky-50 shadow-md scale-[1.02]' 
                        : 'border-white bg-white hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100 hover:scale-[1.01]'
                      }
                    `}
                  >
                    {/* Icon Container */}
                    <div className={`
                      relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300
                      ${isSelected 
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-200 rotate-3' 
                        : 'bg-slate-50 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-600'
                      }
                    `}>
                      <Icon className={`w-7 h-7 transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`} strokeWidth={isSelected ? 2.5 : 1.5} />
                      <div className={`absolute -top-1 -right-1 transition-all duration-300 ${isHovered && !isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                         <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-left flex-1 relative z-10">
                      <h5 className={`font-bold text-[0.95rem] mb-0.5 transition-colors ${isSelected ? 'text-sky-900' : 'text-slate-700 group-hover:text-sky-800'}`}>
                        {option.label}
                      </h5>
                      <p className={`text-xs leading-snug transition-colors ${isSelected ? 'text-sky-700' : 'text-slate-400 group-hover:text-sky-600/80'}`}>
                        {option.description}
                      </p>
                    </div>

                    {/* Chevron */}
                    <div className={`relative z-10 text-sky-500 transition-all duration-300 transform ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                       <ChevronRight className="w-5 h-5" strokeWidth={3} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- FOOTER ACTION --- */}
            <div className="px-8 pb-8 pt-6 flex flex-col items-center gap-4 relative z-10">
              <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-sky-300 to-transparent rounded-full opacity-60 mb-2"></div>

              <button
                id="upload-btn"
                onClick={handleUpload}
                className={`
                  group w-full py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-3 shadow-xl transition-all duration-300 transform active:scale-95 relative overflow-hidden
                  ${kategori 
                    ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-white hover:shadow-sky-500/40 hover:brightness-105' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }
                `}
              >
                {kategori && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>}
                <UploadCloud className={`w-5 h-5 ${kategori ? 'group-hover:animate-bounce' : ''}`} />
                <span className="tracking-wide">{kategori ? 'Upload Sekarang' : 'Pilih Kategori'}</span>
              </button>
              
              <button
                onClick={() => setShowForm(false)}
                className="w-full py-2.5 rounded-full text-slate-400 text-sm font-semibold hover:text-red-500 hover:bg-red-50 hover:shadow-sm transition-all duration-200"
              >
                Batalkan
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default UploadToHighlight;