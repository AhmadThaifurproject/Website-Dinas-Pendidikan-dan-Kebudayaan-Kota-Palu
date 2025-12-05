import { Newspaper, Image, Layout, Menu, Phone } from "lucide-react";

export default function Pengaturan() {
  const menus = [
    {
      title: "Berita Publikasi",
      desc: "Atur berita populer & terkini yang muncul di halaman utama.",
      icon: <Newspaper className="w-10 h-10 text-blue-500" />,
    },
    {
      title: "Poster & Edukasi",
      desc: "Kelola poster kegiatan dan materi edukasi untuk publik.",
      icon: <Image className="w-10 h-10 text-purple-500" />,
    },
    {
      title: "Banner Utama",
      desc: "Ubah gambar dan teks banner utama pada halaman publik.",
      icon: <Layout className="w-10 h-10 text-green-500" />,
    },
    {
      title: "Navigasi Menu",
      desc: "Sesuaikan menu navigasi header pada website publik.",
      icon: <Menu className="w-10 h-10 text-orange-500" />,
    },
    {
      title: "Footer & Kontak",
      desc: "Update alamat, sosial media, dan kontak resmi.",
      icon: <Phone className="w-10 h-10 text-red-500" />,
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
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 items-start border border-gray-100 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {menu.icon}
              <h2 className="text-xl font-semibold text-gray-800">
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
