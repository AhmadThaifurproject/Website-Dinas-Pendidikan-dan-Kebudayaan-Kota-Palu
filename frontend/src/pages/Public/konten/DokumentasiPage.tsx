import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DokumentasiPage: React.FC = () => {
  const [activeTab] = useState('blank');

  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('src', '//www.instagram.com/embed.js');
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ================= HEADER / BANNER SECTION ================= */}
      {/* Mengadopsi style referensi: Rounded bottom, Dark Theme, Glow Effects, & Animations */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-40 pb-44 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          
          {/* --- Background Effects (Dari Referensi) --- */}
          {/* Gradient Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
          
          {/* Blue Glow (Top Right) */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
          
          {/* Indigo Glow (Bottom Left) */}
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
          
          {/* Stardust Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

          {/* --- Content Container --- */}
          <div className="relative container mx-auto max-w-5xl text-center z-10">
            
            {/* Breadcrumb (Disesuaikan agar centered dan elegan dengan Motion) */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-2 text-sm text-indigo-300 font-medium tracking-widest uppercase mb-6"
            >
              <span className="hover:text-white transition-colors duration-300 cursor-pointer">Galeri</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400">Sosial Media</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Dokumentasi <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Kegiatan Dinas
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Arsip visual, sorotan kegiatan, dan momen penting dalam upaya memajukan pendidikan di Kota Palu.
            </motion.p>

             {/* Decorative Element (Garis kecil di bawah - Sesuai Referensi) */}
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "6rem" }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"
             ></motion.div>
          </div>
        </div>
      </div>

      {/* ================= KONTEN UTAMA (Instagram) ================= */}
      {/* Container ditarik ke atas (-mt-32) agar menumpuk di atas banner (efek floating mewah) */}
      <div className="relative z-30 -mt-32 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
            
            {/* Card Container untuk Embed */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-12 overflow-hidden relative"
            >
                
                {/* Dekorasi Background Card (Gradient Top Line) */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Highlight Terbaru</h2>
                    <p className="text-slate-500">Ikuti update terbaru kami di Instagram</p>
                </div>

                <div className="flex justify-center items-center">
                    {/* Instagram Embed Code */}
                    <blockquote
                    className="instagram-media"
                    data-instgrm-permalink="https://www.instagram.com/reel/DIKqTA2yhRo/?utm_source=ig_embed&amp;utm_campaign=loading"
                    data-instgrm-version="14"
                    style={{
                        background: '#FFF',
                        border: 0,
                        borderRadius: 3,
                        boxShadow: 'none', 
                        margin: '1px',
                        maxWidth: 540,
                        minWidth: 326,
                        padding: 0,
                        width: 'calc(100% - 2px)'
                    }}
                    ></blockquote>
                </div>
            </motion.div>
            
        </div>
      </div>
    </div>
  );
};

export default DokumentasiPage;