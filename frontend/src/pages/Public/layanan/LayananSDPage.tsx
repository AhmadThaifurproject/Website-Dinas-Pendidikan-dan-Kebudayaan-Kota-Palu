import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  School,
  Repeat,
  Database,
  DollarSign,
  Hammer,
  FileText,
  FileX2,
  FileBadge,
} from "lucide-react";

type Layanan = {
  title: string;
  description: string;
  icon: JSX.Element;
  path: string;
};

// Data Layanan SD
const SdPage: Layanan[] = [
  {
    title: "PPDB SD",
    description: "Informasi dan pengajuan pendaftaran siswa baru tingkat SD di Kota.",
    icon: <School className="w-8 h-8 text-blue-600" />,
    path: "/sd/layanan/ppdb",
  },
  {
    title: "Mutasi Siswa",
    description: "Prosedur mutasi masuk dan keluar siswa antar sekolah tingkat SD.",
    icon: <Repeat className="w-8 h-8 text-purple-600" />,
    path: "/sd/layanan/mutasi-siswa",
  },
  {
    title: "Data Sekolah",
    description: "Akses informasi profil sekolah SD, akreditasi, dan data pendukung lainnya.",
    icon: <Database className="w-8 h-8 text-green-600" />,
    path: "/sd/layanan/data-sekolah",
  },
  {
    title: "Dana BOS Sekolah",
    description: "Informasi pengajuan dan pelaporan dana BOS untuk sekolah tingkat SD.",
    icon: <DollarSign className="w-8 h-8 text-yellow-600" />,
    path: "/sd/layanan/bos",
  },
  {
    title: "Sarana & Prasarana",
    description: "Layanan permohonan bantuan fasilitas untuk sekolah SD.",
    icon: <Hammer className="w-8 h-8 text-red-600" />,
    path: "/sd/layanan/sapras",
  },
  {
    title: "Legalisir Ijazah",
    description: "Layanan legalisir dokumen ijazah secara resmi dari Dinas Pendidikan.",
    icon: <FileText className="w-8 h-8 text-fuchsia-600" />,
    path: "/sd/layanan/legalisir",
  },
  {
    title: "Suket Ijazah Rusak",
    description: "Permohonan surat pengganti karena ijazah rusak atau kesalahan penulisan.",
    icon: <FileX2 className="w-8 h-8 text-orange-600" />,
    path: "/sd/layanan/suket",
  },
  {
    title: "Surat Pengganti Ijazah",
    description: "Ajukan surat pengganti jika ijazah hilang atau tidak dapat digunakan.",
    icon: <FileBadge className="w-8 h-8 text-teal-600" />,
    path: "/sd/layanan/suket-gantijazah",
  },
];

export default function LayananSDPage() {
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
              <span className="text-blue-400">Layanan SD</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Layanan Pendidikan <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Sekolah Dasar (SD)
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Layanan terpadu untuk mendukung kegiatan akademik, administrasi kesiswaan, dan operasional Sekolah Dasar di Kota Palu.
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
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Portal Layanan SD</h2>
                <p className="text-slate-500">Silakan pilih menu layanan di bawah ini untuk melihat persyaratan dan prosedur.</p>
            </motion.div>

            {/* Grid Layanan */}
            {/* Menggunakan grid-cols-4 untuk layout responsif 8 item (2 baris rapi) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {SdPage.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        viewport={{ once: true }}
                    >
                        <Link to={item.path} className="block h-full">
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
                                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                                    {item.description}
                                </p>
                                
                                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                                    Akses Layanan →
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Contact Section Modern */}
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
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Bidang Pembinaan SD</h2>
                        <p className="text-indigo-200">Hubungi kami untuk konsultasi seputar PPDB, BOS, dan kesiswaan SD.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                            <Phone className="w-5 h-5 text-indigo-300" />
                            <span className="font-semibold tracking-wide">(0451) 123456</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                            <Mail className="w-5 h-5 text-indigo-300" />
                            <span className="font-semibold tracking-wide">sd@disdik.palu.go.id</span>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
}