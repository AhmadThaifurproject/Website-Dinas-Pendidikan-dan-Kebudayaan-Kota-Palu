import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Profile {
  name: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pimpinan');

  const profiles: Record<string, Profile[]> = {
    pimpinan: [
      {
        name: 'Hardi, S.Pd., M.Pd.',
        title: 'Kepala Dinas Pendidikan',
        subtitle: 'Kota Palu',
        image: 'public/images/foto2 struktural disdikbud/Pak_Hardi_KADIS_DISDIKBUD_PALU.JPG',
        description: 'Bertanggung jawab atas seluruh kegiatan pendidikan di Kota Palu.'
      },
      {
        name: 'Evi Oktavia, S.T., M.M.',
        title: 'Sekretaris Dinas Pendidikan',
        subtitle: 'Kota Palu',
        image: 'public/images/foto2 struktural disdikbud/Ibu_EVI_Sekretaris_DISDIKBUD.JPG',
        description: 'Mengelola administrasi, keuangan, dan koordinasi antar bidang.'
      }
    ],
    bidang: [
      {
        name: 'Taufik, S.Sos., M.Si',
        title: 'Kepala Bidang PAUD',
        subtitle: 'Pendidikan Anak Usia Dini',
        image: 'public/images/foto2 struktural disdikbud/Pak Taufik Kabid PAUD.JPG',
        description: 'Mengembangkan dan mengawasi program PAUD.'
      },
      {
        name: 'Ahmadi, SE.,M.Pd',
        title: 'Kepala Bidang SD',
        subtitle: 'Sekolah Dasar',
        image: 'public/images/foto2 struktural disdikbud/Pak Ahmadi KABID SD.JPG',
        description: 'Mengelola pendidikan tingkat sekolah dasar.'
      },
      {
        name: 'Erwin, S.Pd.,M.PFis',
        title: 'Kepala Bidang SMP',
        subtitle: 'Sekolah Menengah Pertama',
        image: 'public/images/foto2 struktural disdikbud/Pak Erwin KABID SMP.jpg',
        description: 'Bertanggung jawab atas pendidikan menengah pertama.'
      },
      {
        name: 'Titi Rahma, SE.,M.Ak',
        title: 'Kepala Bidang Ketenagaan',
        subtitle: 'Manajemen SDM',
        image: 'public/images/foto2 struktural disdikbud/avatar-1577909_1920.png',
        description: 'Mengelola pembinaan tenaga pendidik.'
      },
      {
        name: 'Arham, S.Pd.,M.Si',
        title: 'Kepala Bidang Kebudayaan',
        subtitle: 'Pengembangan Budaya',
        image: 'public/images/foto2 struktural disdikbud/Pak Arham Kabid Kebudayaan (1).JPG',
        description: 'Melestarikan nilai budaya dalam pendidikan.'
      },
      {
        name: 'Siti Patimasang, SE., MM',
        title: 'Analisis Keuangan Pusat dan Daerah Ahli Muda',
        subtitle: 'Keuangan Daerah',
        image: 'public/images/foto2 struktural disdikbud/ibu siti KABID Aset dan Keuangan.jpg',
        description: 'Mengelola dan menganalisis keuangan daerah secara profesional.'
      },
      {
        name: 'Masnuni, S.Sos',
        title: 'Kasubag Kepegawaian dan Umum',
        subtitle: 'Kepegawaian & Administrasi',
        image: 'public/images/foto2 struktural disdikbud/avatar-1577909_1920.png',
        description: 'Mendukung kelancaran administrasi dan kepegawaian dinas.'
      }
    ],
  };

  const bidangInfo = {
    pimpinan: 'Pimpinan Dinas Pendidikan Kota Palu bertanggung jawab atas perencanaan strategis dan pengembangan pendidikan.',
    bidang: 'Bidang teknis mengelola program pendidikan sesuai jenjang untuk peningkatan kualitas.',
    struktur: 'Struktur organisasi Dinas Pendidikan Kota Palu mencerminkan koordinasi yang efisien dan kolaboratif antar bidang.'
  };

  const tabs = [
    { id: 'pimpinan', label: 'Pimpinan Dinas' },
    { id: 'bidang', label: 'Kepala Bidang' },
    { id: 'struktur', label: 'Struktur Organisasi' }
  ];

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
              <span className="text-blue-400">Profil Pejabat</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
            >
              Profil Pejabat <br className="hidden md:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient-x">
                Dinas Pendidikan
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-300 text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8"
            >
              Mengenal struktur kepemimpinan dan bidang teknis yang berperan dalam mengelola dan mengembangkan kualitas pendidikan di Kota Palu.
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
      <div className="relative z-30 -mt-32 pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
            
            {/* --- Control Panel Card (Tabs) --- */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 mb-12"
            >
                {/* Tabs Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                relative px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300
                                ${activeTab === tab.id 
                                    ? 'text-white shadow-lg shadow-indigo-500/30' 
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}
                            `}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Info Text */}
                <div className="text-center max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-slate-600 leading-relaxed text-lg"
                        >
                            {bidangInfo[activeTab as keyof typeof bidangInfo]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* --- Content Area (Grid or Image) --- */}
            <AnimatePresence mode="wait">
                {activeTab === 'struktur' ? (
                    <motion.div
                        key="struktur"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 max-w-4xl w-full">
                            <img
                                src="public/images/Struktur Disdikbud.jpg"
                                alt="Struktur Organisasi"
                                className="w-full h-auto rounded-2xl"
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center"
                    >
                        <div className={`gap-8 w-full ${
                            activeTab === 'pimpinan' 
                                ? 'flex flex-wrap justify-center' // Centered layout for small number of items
                                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                            }`}
                        >
                            {profiles[activeTab].map((profile, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group ${activeTab === 'pimpinan' ? 'w-full md:w-[400px]' : ''}`}
                                >
                                    <div className="aspect-[3/4] overflow-hidden relative bg-slate-200">
                                        <img
                                            src={profile.image}
                                            alt={profile.name}
                                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                        
                                        {/* Floating Title on Image */}
                                        <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                                            <p className="text-sm font-medium text-blue-300 mb-1 uppercase tracking-wider">{profile.subtitle}</p>
                                            <h3 className="text-xl font-bold leading-tight">{profile.name}</h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="mb-4">
                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide">
                                                {profile.title}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {profile.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;