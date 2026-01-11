import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, X, MapPin, Phone, Mail, GraduationCap } from "lucide-react";

const Footer = () => {
  const backgroundImagePath = "url('/images/BG pola footer.png')";

  return (
    <footer className="relative pt-24 pb-10 font-sans text-slate-400">
      
      {/* ================= BACKGROUND LAYER (TETAP SAMA) ================= */}
      <div className="absolute inset-0 bg-[#0f172a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay invert"
          style={{
            backgroundImage: backgroundImagePath,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
      </div>


      {/* ================= CONTENT LAYER ================= */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10">

        {/* GRID 4 KOLOM UTAMA (TETAP SAMA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* ... (Konten grid sama seperti sebelumnya, saya singkat agar fokus ke bawah) ... */}
          {/* KOLOM 1 */}
          <div className="space-y-6 lg:pr-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-900/20">
                 <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-white text-lg font-bold uppercase leading-tight tracking-wide">
                Dinas Pendidikan<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Kota Palu</span>
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 font-light">
              Mewujudkan layanan pendidikan yang berkualitas, berkarakter, dan berdaya saing untuk masa depan Kota Palu yang lebih cerah.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Instagram, X].map((Icon, index) => (
                <a key={index} href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 shadow-sm">
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
          {/* KOLOM 2 - PROFIL */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-6 flex flex-col gap-1">
              Profil Kami
              <span className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Profil Dinas", path: "/profile" },
                { label: "Brand Identity", path: "/brand-identity" },
                { label: "Sejarah", path: "/sejarah" },
                { label: "Kalender Kegiatan", path: "/kalender" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={item.path} 
                    // TAMBAHAN PENTING: Agar saat diklik langsung scroll ke paling atas
                    onClick={() => window.scrollTo(0, 0)} 
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* KOLOM 3 - LAYANAN */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-6 flex flex-col gap-1">
              Layanan
              <span className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Kepegawaian", path: "/kepegawaian" },
                { label: "Perencanaan", path: "/perencanaan" },
                { label: "Ketenagaan", path: "/ketenagaan" },
                { label: "Kebudayaan", path: "/kebudayaan" },
                { label: "PAUD", path: "/paud" },
                { label: "SD", path: "/sd" },
                { label: "SMP", path: "/smp" },
                { label: "Sub Sekretariat", path: "/sub-sekretariat" },
                { label: "Aset & Keuangan", path: "/aset-dan-keuangan" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={item.path} 
                    // TAMBAHAN PENTING: Agar saat diklik langsung scroll ke paling atas
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* KOLOM 4 */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-6 flex flex-col gap-1">
              Hubungi Kami
              <span className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            </h3>
            <div className="relative mb-8">
               <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-1 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                  <input
                    type="email"
                    placeholder="Email Anda..."
                    className="bg-transparent flex-grow px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none w-full"
                  />
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold uppercase tracking-wide px-5 py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-blue-900/20">
                    Kirim
                  </button>
               </div>
            </div>
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4 group">
                <div className="shrink-0 p-2 rounded-lg bg-slate-800/80 group-hover:bg-blue-500/10 transition-colors border border-slate-700/50">
                  <MapPin size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-slate-400 leading-snug group-hover:text-slate-300 transition-colors">
                    Jl. Bantilan, No. 00,<br/> Palu Barat, Kota Palu, Sulteng
                </p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="shrink-0 p-2 rounded-lg bg-slate-800/80 group-hover:bg-blue-500/10 transition-colors border border-slate-700/50">
                  <Mail size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <a href="mailto:disdik@palukota.go.id" className="text-slate-400 group-hover:text-blue-400 transition-colors">
                    disdik@palukota.go.id
                </a>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="shrink-0 p-2 rounded-lg bg-slate-800/80 group-hover:bg-blue-500/10 transition-colors border border-slate-700/50">
                  <Phone size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">(0451) 123456</p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            BAGIAN COPYRIGHT DENGAN SEPARATOR ELEGAN
        ====================================================================== */}
        <div className="relative pt-8">
          
          {/* --- DEKORASI GARIS PEMBATAS (The Elegant Separator) --- */}
          {/* Container Absolut untuk memposisikan garis tepat di atas konten copyright */}
          <div className="absolute top-0 left-0 right-0 h-px">
            
            {/* Layer 1: Garis dasar "kaca" (Glassy base line) */}
            <div className="absolute inset-0 bg-white/10"></div>
            
            {/* Layer 2: Aksen Cahaya Berpendar (Glowing Accent) 
                Menggunakan gradient 'via-blue-500/30' agar bagian tengahnya menyala 
                dan 'from/to-transparent' agar ujungnya memudar halus. */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent shadow-[0_-1px_8px_rgba(59,130,246,0.3)]"></div>
          </div>

          {/* --- KONTEN COPYRIGHT --- */}
          <div className="flex flex-col md:flex-row justify-center items-center text-xs text-slate-500 relative z-10">
            <p className="mb-4 md:mb-0 text-center md:text-left font-medium">
              © {new Date().getFullYear()} Dinas Pendidikan Kota Palu. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;