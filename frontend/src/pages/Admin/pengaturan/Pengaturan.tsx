import React from "react";
import { Newspaper, Image, Layout, Menu, Phone } from "lucide-react";

// 1. Definisikan Tipe Props
interface PengaturanProps {
  setActiveMenu: (menu: string) => void;
}

// 2. Terima Props di komponen
export default function Pengaturan({ setActiveMenu }: PengaturanProps) {
  
  const menus = [
    {
      title: "Berita Publikasi",
      desc: "Atur berita populer & terkini yang muncul di halaman utama.",
      icon: <Newspaper className="w-10 h-10 text-blue-500" />,
      action: "berita" // Opsional: jika mau link ke berita
    },
    {
      title: "Poster & Edukasi",
      desc: "Kelola poster kegiatan dan materi edukasi untuk publik.",
      icon: <Image className="w-10 h-10 text-purple-500" />,
      action: "agenda" // <--- INI KUNCINYA (Sesuai dengan case di DashboardAdmin)
    },
    {
      title: "Banner Utama",
      desc: "Ubah gambar dan teks banner utama pada halaman publik.",
      icon: <Layout className="w-10 h-10 text-green-500" />,
      action: "" // Belum ada halaman
    },
    {
      title: "Navigasi Menu",
      desc: "Sesuaikan menu navigasi header pada website publik.",
      icon: <Menu className="w-10 h-10 text-orange-500" />,
      action: "" // Belum ada halaman
    },
    {
      title: "Footer & Kontak",
      desc: "Update alamat, sosial media, dan kontak resmi.",
      icon: <Phone className="w-10 h-10 text-red-500" />,
      action: "" // Belum ada halaman
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
            // 3. Tambahkan onClick Handler
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