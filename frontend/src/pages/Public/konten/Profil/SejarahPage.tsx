import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function SejarahPage() {
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
              <span className="text-blue-400">Profil Dinas</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Sejarah & Perjalanan <br className="hidden md:block"/> 
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
              Menelusuri jejak langkah transformasi pendidikan di Kota Palu dari masa ke masa dalam upaya mencerdaskan kehidupan bangsa.
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
        <div className="container mx-auto max-w-6xl">
            
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-hidden"
            >
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                {/* Intro Text Center */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wide mb-4 border border-blue-100">
                        TENTANG KAMI
                    </span>
                    <h2 className="text-3xl font-bold text-slate-800 mb-6">Dedikasi Untuk Pendidikan</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Dinas Pendidikan Kota Palu adalah lembaga yang bertanggung jawab untuk pengelolaan dan pengembangan mutu pendidikan. Dengan komitmen tinggi, instansi ini terus berinovasi untuk memberikan akses pendidikan yang berkualitas bagi seluruh warga.
                    </p>
                </div>

                {/* Grid Content: Image & Text */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column: Images */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="group relative overflow-hidden rounded-2xl shadow-lg border border-slate-100">
                             {/*  */}
                            <img
                                src="/images/dinaspendidikan.jpg" 
                                alt="Gedung Dinas Pendidikan"
                                className="w-full h-64 lg:h-80 object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-sm font-medium">Gedung Dinas Pendidikan</p>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-2xl shadow-lg border border-slate-100">
                             {/*  */}
                            <img
                                src="/images/map.png"
                                alt="Arsip Pendidikan"
                                className="w-full h-48 lg:h-60 object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-sm font-medium">Peta Sebaran Sekolah</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Text Content */}
                    <div className="lg:col-span-7">
                        <div className="prose prose-lg text-slate-600 space-y-6 text-justify">
                            <p>
                                <span className="font-bold text-slate-800 text-xl">Dinas Pendidikan Kota Palu</span> berdiri sejak awal terbentuknya pemerintahan kota sebagai upaya strategis untuk mengelola dan mengembangkan sektor pendidikan secara mandiri. Pada masa-masa awal, operasional dinas ini dimulai dengan sumber daya yang terbatas, namun memiliki semangat besar untuk meletakkan fondasi pendidikan yang kokoh di tengah masyarakat.
                            </p>
                            <p>
                                Seiring berjalannya waktu dan dinamika perkembangan kota, kebutuhan akan manajemen pendidikan yang lebih kompleks mendorong transformasi struktur organisasi. Dinas ini mulai mengembangkan divisi-divisi teknis yang fokus pada peningkatan mutu pendidikan dasar dan menengah, serta program pengembangan kompetensi guru yang berkelanjutan.
                            </p>
                            <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500 my-8">
                                <p className="italic text-blue-800 m-0 font-medium">
                                    "Di awal tahun 2000-an, menjadi titik balik digitalisasi administrasi pendidikan di Kota Palu dengan penerapan sistem manajemen data sekolah berbasis teknologi."
                                </p>
                            </div>
                            <p>
                                Hingga kini, Dinas Pendidikan Kota Palu terus bertransformasi dengan visi mewujudkan layanan pendidikan yang <strong>inklusif, adil, dan berdaya saing global</strong>. Berbagai penghargaan dan pencapaian telah diraih, menjadi bukti nyata keberhasilan inovasi pembelajaran dan penguatan pendidikan karakter yang diterapkan di seluruh satuan pendidikan di bawah naungannya.
                            </p>
                        </div>
                    </div>

                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
}

export default SejarahPage;