import React, { useState } from 'react';
import { motion } from 'framer-motion';

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
    { id: 'pimpinan', label: 'Dinas' },
    { id: 'bidang', label: 'Bidang' },
    { id: 'struktur', label: 'Struktur' }
  ];

  return (
    <div>
      {/* Banner Section: Profil Pejabat Dinas Pendidikan dan Kebudayaan Kota Palu */}
<section className="relative h-[45vh] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0"></div>

  {/* Content */}
  <div className="relative z-10 h-full flex items-start px-10 md:px-24 pt-16 md:pt-20">
    <div className="max-w-2xl">
      {/* Garis kecil dekoratif */}
      <div className="w-20 h-1 bg-yellow-300 mb-4"></div>

      {/* Breadcrumb */}
      <div className="text-sm text-yellow-300 mb-2 tracking-widest uppercase">
        <a href="/" className="hover:underline text-white font-medium">Beranda</a>
        <span className="mx-1">/</span>
        <span className="text-white">Profil Pejabat</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-wide text-white drop-shadow-lg mb-4">
        Profil Pejabat<br className="hidden md:block" /> Dinas Pendidikan Kota Palu
      </h1>

      {/* Description */}
      <p className="text-lg text-white/90 font-light leading-relaxed">
        Mengenal struktur kepemimpinan dan bidang teknis di Dinas Pendidikan dan Kebudayaan Kota Palu yang berperan dalam mengelola dan mengembangkan kualitas pendidikan.
      </p>
    </div>
  </div>
</section>


      {/* Konten */}
      <div className="py-14">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-md">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tentang Section */}
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Tentang</h2>
            <p className="text-gray-600">{bidangInfo[activeTab as keyof typeof bidangInfo]}</p>
          </div>

          {/* Struktur Image */}
          {activeTab === 'struktur' && (
            <div className="flex justify-center">
              <img
                src="public\images\Struktur Disdikbud.jpg"
                alt="Struktur Organisasi"
                className="rounded-lg shadow-lg max-w-full md:max-w-3xl"
              />
            </div>
          )}

          {(activeTab === 'pimpinan' || activeTab === 'bidang') && (
  <div className="flex justify-center">
    <div className={`gap-8 ${
      activeTab === 'pimpinan' 
        ? 'inline-grid grid-cols-1 sm:grid-cols-2' 
        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`
    }>
      {profiles[activeTab].map((profile, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.04 }}
          className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden max-w-xs"
        >
          <div className="w-full aspect-[4/4] overflow-hidden">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
            <p className="text-sm text-blue-600 font-semibold">{profile.title}</p>
            <p className="text-xs text-gray-500 mb-2">{profile.subtitle}</p>
            <p className="text-sm text-gray-600">{profile.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
