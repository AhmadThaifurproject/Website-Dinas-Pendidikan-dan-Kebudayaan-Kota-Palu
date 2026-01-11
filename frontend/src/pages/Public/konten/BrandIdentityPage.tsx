import React from 'react';
import { motion } from 'framer-motion';

const BrandIdentityPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* ================= HEADER / BANNER SECTION ================= */}
      {/* Mengadopsi style referensi: Rounded bottom, Dark Theme, Glow Effects */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-32 pb-40 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          
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
            
            {/* Breadcrumb (Disesuaikan agar centered dan elegan) */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-2 text-sm text-indigo-300 font-medium tracking-widest uppercase mb-6"
            >
              <a href="/" className="hover:text-white transition-colors duration-300">Beranda</a>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400">Visi Misi</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Visi & Misi <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Dinas Pendidikan Kota Palu
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Menyediakan arah dan tujuan strategis bagi pengembangan pendidikan
              di Kota Palu yang jelas, terarah, dan berorientasi pada kualitas serta pemerataan.
            </motion.p>

             {/* Decorative Element (Garis kecil di bawah) */}
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
      {/* Menggunakan negative margin top agar menyatu dengan banner */}
      <div className="relative z-10 -mt-20 pb-20 px-6">
        <div className="container mx-auto">
          
          {/* Card Visi */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto mb-16 border border-slate-100 relative overflow-hidden"
          >
             {/* Aksen background tipis pada card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
            
            <div className="relative z-10 text-center">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold tracking-wide mb-4">
                VISI UTAMA
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">Visi Kami</h2>
              <p className="text-xl md:text-2xl text-slate-600 font-serif italic leading-relaxed">
                “Terwujudnya pendidikan yang bermutu, berkarakter, dan berdaya saing menuju Kota Palu yang inovatif dan berkelanjutan.”
              </p>
            </div>
          </motion.div>

          {/* Section Misi */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Misi Kami</h2>
              <p className="text-slate-500 mt-2">Langkah strategis untuk mencapai visi pendidikan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Meningkatkan akses dan pemerataan pendidikan yang berkualitas.",
                "Menumbuhkan karakter peserta didik yang religius, disiplin, dan peduli lingkungan.",
                "Mengembangkan kompetensi pendidik dan tenaga kependidikan.",
                "Mendorong inovasi pembelajaran berbasis teknologi.",
                "Memperkuat tata kelola pendidikan yang transparan dan akuntabel.",
              ].map((misi, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  // Card styling disesuaikan agar lebih modern (White card, border halus)
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                    <span className="text-indigo-600 font-bold text-xl group-hover:text-white transition-colors">{idx + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                    Misi ke-{idx + 1}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {misi}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BrandIdentityPage;