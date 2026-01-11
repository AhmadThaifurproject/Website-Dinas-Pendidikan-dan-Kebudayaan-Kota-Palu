import React from "react";
import {
  FileUp,
  Briefcase,
  Users,
  BadgeCheck,
  ScrollText,
  Phone,
  Mail,
  BarChart3,
  ClipboardList,
  Handshake,
  Stamp,
  Medal,
  GraduationCap,
  PlaneTakeoff,
  FileText,
  BookOpen,
  Megaphone,
  FileSignature,
  UserCog
} from "lucide-react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

type Layanan = {
  title: string;
  description: string;
  icon: JSX.Element;
  path: string;
};

// Data Layanan Kepegawaian (Updated styling classes for consistency)
const layananKepegawaian: Layanan[] = [
  {
    title: "Kenaikan Pangkat Reguler",
    description: "Pengajuan kenaikan pangkat reguler untuk guru dan tenaga kependidikan.",
    icon: <FileUp className="w-8 h-8 text-blue-600" />,
    path: "/umum-kepegawaian/layanan/kenaikan-pangkat",
  },
  {
    title: "Pelayanan Pensiun",
    description: "Prosedur dan pengajuan pensiun termasuk BUP dan pensiun janda/duda.",
    icon: <Briefcase className="w-8 h-8 text-green-600" />,
    path: "/umum-kepegawaian/layanan/pensiun",
  },
  {
    title: "Izin Belajar",
    description: "Pengajuan izin belajar bagi pegawai ASN di lingkungan Dinas Pendidikan.",
    icon: <GraduationCap className="w-8 h-8 text-cyan-600" />,
    path: "/umum-kepegawaian/layanan/izin-belajar",
  },
  {
    title: "Pelayanan Cuti",
    description: "Pengajuan berbagai jenis cuti pegawai, termasuk umroh/haji dan melahirkan.",
    icon: <PlaneTakeoff className="w-8 h-8 text-fuchsia-600" />,
    path: "/umum-kepegawaian/layanan/cuti-umroh-haji-melahirkan",
  },
  {
    title: "SK Jabatan Guru",
    description: "Permohonan SK jabatan untuk guru dan tenaga pendidik.",
    icon: <Stamp className="w-8 h-8 text-lime-600" />,
    path: "/umum-kepegawaian/layanan/sk-jabatan-guru",
  },
  {
    title: "Kenaikan Fungsional",
    description: "Pengajuan SK jabatan terkait kenaikan jabatan fungsional.",
    icon: <FileSignature className="w-8 h-8 text-violet-600" />,
    path: "/umum-kepegawaian/layanan/sk-jabatan-kenaikan-fungsional",
  },
  {
    title: "Satya Lencana Karya Satya",
    description: "Pengajuan penghargaan Satya Lencana untuk ASN berprestasi.",
    icon: <Medal className="w-8 h-8 text-amber-600" />,
    path: "/umum-kepegawaian/layanan/satya-lencana-karya-satya",
  },
  {
    title: "SK Gaji Berkala",
    description: "Proses penerbitan dan pembaruan SK kenaikan gaji berkala ASN.",
    icon: <FileText className="w-8 h-8 text-orange-600" />,
    path: "/umum-kepegawaian/layanan/sk-gaji-berkala",
  },
  {
    title: "Mutasi Guru",
    description: "Permohonan mutasi tempat tugas bagi guru.",
    icon: <UserCog className="w-8 h-8 text-rose-600" />,
    path: "/umum-kepegawaian/layanan/mutasi-guru",
  },
  {
    title: "Rekomendasi Izin Penelitian",
    description: "Permohonan izin penelitian di lingkungan Dinas Pendidikan.",
    icon: <BookOpen className="w-8 h-8 text-blue-500" />,
    path: "/umum-kepegawaian/layanan/rekomendasi-izin-penelitian",
  },
  {
    title: "Izin Cerai",
    description: "Pengajuan izin cerai bagi ASN sesuai ketentuan perundang-undangan.",
    icon: <Handshake className="w-8 h-8 text-red-500" />,
    path: "/umum-kepegawaian/layanan/izin-cerai",
  },
  {
    title: "Batas Usia Pensiun (BUP)",
    description: "Penyampaian pengaduan, saran, atau keluhan terkait layanan kepegawaian.",
    icon: <ClipboardList className="w-8 h-8 text-sky-500" />,
    path: "/umum-kepegawaian/layanan/bup",
  },
];

export default function LayananKepegawaianPage() {
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
              <span className="text-blue-400">Layanan Kepegawaian</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Layanan Umum <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                & Kepegawaian
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Informasi lengkap dan prosedur layanan terkait manajemen Sumber Daya Manusia (SDM) di lingkungan Dinas Pendidikan Kota Palu.
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
      {/* Floating Layout (-mt-32) */}
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
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Portal Layanan Kepegawaian</h2>
                <p className="text-slate-500">Pilih jenis layanan di bawah ini untuk melihat persyaratan dan prosedur lengkap.</p>
            </motion.div>

            {/* Grid Layanan */}
            {/* Menggunakan grid-cols-4 untuk layar besar karena item banyak */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {layananKepegawaian.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }} // Delay dipercepat agar animasi tidak terlalu lama
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
                                
                                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">
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
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Sub-Bagian Umum & Kepegawaian</h2>
                        <p className="text-indigo-200">Hubungi kami untuk konsultasi langsung terkait administrasi pegawai.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                            <Phone className="w-5 h-5 text-indigo-300" />
                            <span className="font-semibold tracking-wide">(0451) 123456</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                            <Mail className="w-5 h-5 text-indigo-300" />
                            <span className="font-semibold tracking-wide">kepegawaian@disdik.palu.go.id</span>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
}