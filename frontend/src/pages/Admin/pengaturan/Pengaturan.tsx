import React from "react";
import { Newspaper, Image, Layout, Menu, Phone, UserCog, Calendar } from "lucide-react"; // Tambahkan Calendar

interface PengaturanProps {
  setActiveMenu: (menu: string) => void;
}

export default function Pengaturan({ setActiveMenu }: PengaturanProps) {
  
  const menus = [
    
    {
      title: "Kalender Pendidikan", // Menu Baru
      desc: "Kelola agenda akademik, hari libur, dan berita acara publik.",
      icon: <Calendar className="w-10 h-10 text-emerald-500" />,
      action: "kontrol-kalender" 
    },
    {
      title: "Profil Pejabat",
      desc: "Kelola data pimpinan, kepala bidang, dan struktur organisasi.",
      icon: <UserCog className="w-10 h-10 text-indigo-500" />,
      action: "profil-pejabat" 
    },
    {
      title: "Poster & Edukasi",
      desc: "Kelola poster kegiatan dan materi edukasi untuk publik.",
      icon: <Image className="w-10 h-10 text-purple-500" />,
      action: "agenda" 
    },
  
   
   
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Pengaturan Halaman Publik
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu, i) => (
          <div
            key={i}
            onClick={() => {
              if (menu.action) {
                setActiveMenu(menu.action);
              } else {
                alert("Fitur ini belum tersedia / belum dihubungkan.");
              }
            }}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 items-start border border-gray-100 hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="group-hover:scale-110 transition-transform duration-300">
                 {menu.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {menu.title}
              </h2>
            </div>
            <p className="text-sm text-gray-600">{menu.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}