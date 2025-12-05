import React from 'react';
import { motion } from 'framer-motion';

const BrandIdentityPage: React.FC = () => {
  return (
    <div>

      {/* Banner Section: Visi Misi Dinas Pendidikan dan Kebudayaan Kota Palu */}
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
              <span className="text-white">Visi Misi</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-wide text-white drop-shadow-lg mb-4">
              Visi & Misi<br className="hidden md:block" /> Dinas Pendidikan Kota Palu
            </h1>

            {/* Description */}
            <p className="text-lg text-white/90 font-light leading-relaxed">
              Menyediakan arah dan tujuan strategis bagi pengembangan pendidikan
              di Kota Palu melalui visi dan misi yang jelas, terarah, dan
              berorientasi pada kualitas dan pemerataan.
            </p>
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Visi</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              “Terwujudnya pendidikan yang bermutu, berkarakter, dan berdaya saing menuju Kota Palu yang inovatif dan berkelanjutan.”
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Misi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-blue-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  <h3 className="text-lg font-semibold text-blue-700 mb-2">Misi {idx + 1}</h3>
                  <p className="text-gray-700 leading-relaxed">{misi}</p>
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
