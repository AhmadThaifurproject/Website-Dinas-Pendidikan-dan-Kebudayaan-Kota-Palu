import React, { useState, useEffect } from 'react';

const DokumentasiPage: React.FC = () => {
  const [activeTab] = useState('blank');

  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('src', '//www.instagram.com/embed.js');
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <section className="relative h-[45vh] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4">Dokumentasi</h1>
          <p className="text-xl">Dokumentasi kegiatan Dinas Pendidikan</p>
        </div>
      </section>

      {/* Konten Utama */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink="https://www.instagram.com/reel/DIKqTA2yhRo/?utm_source=ig_embed&amp;utm_campaign=loading"
              data-instgrm-version="14"
              style={{
                background: '#FFF',
                border: 0,
                borderRadius: 3,
                boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                margin: '1px',
                maxWidth: 540,
                minWidth: 326,
                padding: 0,
                width: 'calc(100% - 2px)'
              }}
            ></blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DokumentasiPage;
