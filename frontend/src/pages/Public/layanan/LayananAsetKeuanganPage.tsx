import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, BadgePercent, Landmark, Phone, Mail } from "lucide-react";

// Data layanan aset dan keuangan
const layananAsetKeuangan = [
  {
    title: "Pengajuan Gaji",
    description: "Pelayanan pengajuan gaji Dinas, Korwil, PAUD, SD, IMB, dan SKB.",
    icon: <BadgePercent className="w-8 h-8 text-purple-600" />,
    path: "/aset-dan-keuangan/layanan/pengajuan-gaji",
  },
  {
    title: "Ubah Password Pajak",
    description: "Layanan untuk melakukan reset atau perubahan password akun pajak.",
    icon: <Landmark className="w-8 h-8 text-amber-600" />,
    path: "/aset-dan-keuangan/layanan/perubahan-password-pajak",
  },
  {
    title: "Verifikasi Dana BOP",
    description: "Verifikasi dana BOP PAUD, TK, SKB, PKBM Non Formal Negeri dan Swasta.",
    icon: <FileText className="w-8 h-8 text-rose-600" />,
    path: "/aset-dan-keuangan/layanan/verifikasi-dana-bop",
  },
];

const AsetKeuanganPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* ================= HEADER / BANNER SECTION ================= */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-40 pb-44 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          
          {/* --- Background Effects --- */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

          {/* --- Content Container --- */}
          <div className="relative container mx-auto max-w-5xl text-center z-10">
            
            {/* Breadcrumb */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-2 text-sm text-indigo-300 font-medium tracking-widest uppercase mb-6"
            >
              <Link to="/" className="hover:text-white transition-colors duration-300">Beranda</Link>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400">Layanan Aset & Keuangan</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Layanan Aset <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                & Keuangan Dinas
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Transparansi dan akuntabilitas dalam pengelolaan aset serta administrasi keuangan di lingkungan Dinas Pendidikan Kota Palu.
            </motion.p>

             {/* Decorative Element */}
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "6rem" }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"
             ></motion.div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      {/* Container "Floating" (-mt-32) */}
      <div className="relative z-30 -mt-32 pb-24 px-4">
        <div className="container mx-auto max-w-7xl">
            
            {/* Intro Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 mb-10 shadow-xl border border-slate-100 text-center max-w-4xl mx-auto relative overflow-hidden"
            >
                {/* Decorative Top Line (Sesuai Referensi) */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Portal Layanan Keuangan</h2>
                <p className="text-slate-500">Silakan pilih salah satu menu layanan di bawah ini untuk informasi lebih lanjut.</p>
            </motion.div>

            {/* Grid Layanan */}
            {/* Menggunakan grid-cols-3 karena jumlah item ganjil (5) agar lebih rapi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {layananAsetKeuangan.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Link to={item.path} className="block h-full">
                            {/* Card Styling (Sesuai Ukuran Referensi p-6) */}
                            <div className="group h-full bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center">
                                
                                {/* Icon Container */}
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors duration-300">
                                    <div className="transition-transform duration-300 group-hover:scale-110">
                                        {item.icon}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow">
                                    {item.description}
                                </p>
                                
                                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
                                    Akses Layanan →
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Contact Section Modern (Sesuai Referensi Dark Theme) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-indigo-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden max-w-5xl mx-auto"
            >
                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl -ml-12 -mb-12"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Pusat Informasi Keuangan</h2>
                        <p className="text-indigo-200">Hubungi kami untuk konsultasi langsung terkait aset & keuangan.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                            <Phone className="w-5 h-5 text-indigo-300" />
                            <span className="font-semibold tracking-wide">(0451) 123456</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                            <Mail className="w-5 h-5 text-indigo-300" />
                            <span className="font-semibold tracking-wide">keuangan@disdik.palu.go.id</span>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AsetKeuanganPage;