import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Calendar, Play } from 'lucide-react';

// --- DUMMY DATA GALERI ---
const categories = ['Semua', 'Pendidikan', 'Kebudayaan', 'Kunjungan', 'Prestasi'];

const dummyGallery = [
  { 
    id: 1, 
    title: 'Festival Budaya Kaili 2026', 
    category: 'Kebudayaan', 
    date: '15 Mei 2026', 
    location: 'Taman GOR Palu',
    image: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=800&auto=format&fit=crop',
    type: 'photo'
  },
  { 
    id: 2, 
    title: 'Penyerahan Bantuan Seragam SD', 
    category: 'Pendidikan', 
    date: '12 Mei 2026', 
    location: 'SDN 1 Palu',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    type: 'photo'
  },
  { 
    id: 3, 
    title: 'Kunjungan Kerja Kementrian', 
    category: 'Kunjungan', 
    date: '08 Mei 2026', 
    location: 'Kantor Disdikbud',
    image: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?q=80&w=800&auto=format&fit=crop',
    type: 'video'
  },
  { 
    id: 4, 
    title: 'Lomba Cerdas Cermat Tingkat SMP', 
    category: 'Prestasi', 
    date: '02 Mei 2026', 
    location: 'Aula Disdikbud',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop',
    type: 'photo'
  },
  { 
    id: 5, 
    title: 'Pelatihan Kurikulum Merdeka Guru PAUD', 
    category: 'Pendidikan', 
    date: '28 Apr 2026', 
    location: 'Hotel Santika',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    type: 'photo'
  },
  { 
    id: 6, 
    title: 'Pameran Seni Pelajar', 
    category: 'Kebudayaan', 
    date: '20 Apr 2026', 
    location: 'Museum Sulawesi Tengah',
    image: 'https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=800&auto=format&fit=crop',
    type: 'photo'
  },
];

export default function DokumentasiPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');

  // Filter Galeri berdasarkan Kategori
  const filteredGallery = dummyGallery.filter(item => 
    activeCategory === 'Semua' || item.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ================= HEADER / BANNER SECTION ================= */}
      {/* Tetap menggunakan desain banner mewah yang sudah fix */}
      <div className="relative z-20 mb-12">
        <div className="bg-[#0f172a] pt-40 pb-44 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#1e293b]"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[100px] rounded-full mix-blend-screen opacity-40"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

          <div className="relative container mx-auto max-w-5xl text-center z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-2 text-sm text-indigo-300 font-medium tracking-widest uppercase mb-6"
            >
              <span className="hover:text-white transition-colors duration-300 cursor-pointer">Media</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400">Galeri Kegiatan</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Dokumentasi <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Visual Dinas
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Arsip momen, sorotan program kerja, dan langkah nyata dalam memajukan sektor pendidikan dan kebudayaan.
            </motion.p>

             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "6rem" }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"
             ></motion.div>
          </div>
        </div>
      </div>

      {/* ================= KONTEN UTAMA (Photo Grid) ================= */}
      <div className="relative z-30 -mt-24 pb-24 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
            
            {/* Filter Pills (Horizontal Scrollable) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-2 md:gap-4 mb-10 overflow-x-auto scrollbar-hide py-2 px-4 bg-white/60 backdrop-blur-md rounded-full shadow-lg border border-white max-w-fit mx-auto"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeCategory === category 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105' 
                      : 'bg-transparent text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>

            {/* Gallery Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              layout // Framer motion prop for smooth filtering re-arrangement
            >
              <AnimatePresence mode="popLayout">
                {filteredGallery.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative h-[350px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-shadow duration-500"
                  >
                    {/* Image Placeholder */}
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                    {/* Icon Type (Photo/Video) - Top Right */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors duration-300">
                      {item.type === 'video' ? <Play size={20} className="ml-1" /> : <Camera size={20} />}
                    </div>

                    {/* Category Badge - Top Left */}
                    <div className="absolute top-5 left-5">
                      <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white bg-indigo-500/80 backdrop-blur-sm rounded-lg">
                        {item.category}
                      </span>
                    </div>

                    {/* Content Details - Bottom */}
                    <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-indigo-400" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-indigo-400" />
                          <span className="truncate max-w-[120px]">{item.location}</span>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State / No Data */}
            {filteredGallery.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <Camera size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Belum Ada Dokumentasi</h3>
                <p className="text-slate-500 mt-2">Belum ada foto atau video untuk kategori ini.</p>
              </div>
            )}
            
        </div>
      </div>
    </div>
  );
}