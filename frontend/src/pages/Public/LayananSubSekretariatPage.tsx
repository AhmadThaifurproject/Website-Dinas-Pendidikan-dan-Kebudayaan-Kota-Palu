import { Phone, Mail, FolderKanban, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const layananSubSekretariat = [
  {
    title: "Tugas dan Fungsi",
    description: "Informasi mengenai tugas dan fungsi Sub Sekretariat dalam mendukung operasional Dinas Pendidikan.",
    icon: <FolderKanban className="w-10 h-10 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/sub-sekretariat/layanan/tugas-fungsi",
  },
  {
    title: "Program Kerja",
    description: "Informasi tentang program kerja dan kegiatan yang dilaksanakan oleh Sub Sekretariat.",
    icon: <ClipboardList className="w-10 h-10 text-green-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/sub-sekretariat/layanan/program-kerja",
  },
];


export default function SubSekretariatPage() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[45vh] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
        <div className="relative z-10 h-full flex items-start px-10 md:px-24 pt-16 md:pt-20">
          <div className="max-w-2xl">
            <div className="w-20 h-1 bg-yellow-300 mb-4"></div>
            <div className="text-sm text-yellow-300 mb-2 tracking-widest uppercase">
              <Link to="/" className="hover:underline text-white font-medium">
                Beranda
              </Link>
              <span className="mx-1">/</span>
              <span className="text-white">Layanan Sub Sekretariat</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              Layanan Sub Sekretariat
            </h1>
            <p className="text-lg text-white/90 font-light">
              Layanan ini menyediakan informasi terkait Sub Sekretariat di lingkungan
              <span className="font-semibold text-white"> Dinas Pendidikan Kota Palu</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <div className="pt-12 max-w-6xl mx-auto px-6">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-center">Informasi Sub Sekretariat</h2>
          <p className="text-gray-600 mb-8 text-center">
            Layanan ini mendukung kelancaran administrasi dan manajemen internal Dinas Pendidikan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {layananSubSekretariat.map((item, index) => (
              <Link
                to={item.path}
                key={index}
                className="group p-6 bg-white border rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center hover:bg-gray-50 flex flex-col h-[250px]"
              >
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>

          {/* Kontak */}
          <div className="mt-12 p-6 bg-gray-100 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Kontak Pelayanan</h2>
            <div className="flex flex-col gap-2 text-gray-800">
              <p className="flex items-center gap-2">
                <Phone className="w-5 h-5" /> (0451) 123456
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5" /> disdikbud@kotapalu.go.id
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
