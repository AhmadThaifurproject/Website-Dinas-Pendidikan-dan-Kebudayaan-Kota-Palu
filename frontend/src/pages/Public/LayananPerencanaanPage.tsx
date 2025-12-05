import { ClipboardList, FileText, BadgePercent, CalendarDays, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

type Layanan = {
  title: string;
  description: string;
  icon: JSX.Element;
  path: string;
};

const layananPerencanaan: Layanan[] = [
  {
    title: "Perencanaan Anggaran",
    description: "Sistem perencanaan dan penganggaran untuk program-program pendidikan.",
    icon: <ClipboardList className="w-10 h-10 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/perencanaan-program/layanan/perencanaan-anggaran",
  },
  {
    title: "Pengembangan Sekolah",
    description: "Informasi tentang rencana pengembangan infrastruktur sekolah.",
    icon: <FileText className="w-10 h-10 text-green-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/perencanaan-program/layanan/pengembangan-sekolah",
  },
  {
    title: "Pelayanan DAPODIK",
    description: "Informasi dan layanan terkait Data Pokok Pendidikan (DAPODIK).",
    icon: <BadgePercent className="w-10 h-10 text-purple-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/perencanaan-program/layanan/dapodik",
  },
  {
    title: "Pengajuan NISN",
    description: "Proses pengajuan Nomor Induk Siswa Nasional (NISN) bagi pelajar.",
    icon: <CalendarDays className="w-10 h-10 text-orange-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/perencanaan-program/layanan/nisn",
  },
  {
    title: "Pengajuan Penerbitan Nomor Pokok Satuan Pendidikan",
    description: "Pengajuan penerbitan nomor pokok untuk satuan pendidikan.",
    icon: <UserCheck className="w-10 h-10 text-red-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/perencanaan-program/layanan/nomor-satuan-pendidikan",
  },
  {
    title: "Pengajuan Penerbitan Nomor Pokok Satuan Yayasan",
    description: "Pengajuan penerbitan nomor pokok untuk satuan yayasan pendidikan.",
    icon: <ClipboardList className="w-10 h-10 text-teal-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/perencanaan-program/layanan/nomor-satuan-yayasan",
  },
  {
    title: "Approval Pengajuan Nomor Unik Pendidik dan Tenaga Kependidikan",
    description: "Proses persetujuan pengajuan nomor unik untuk pendidik dan tenaga kependidikan.",
    icon: <FileText className="w-10 h-10 text-pink-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/perencanaan-program/layanan/approval-nuptk",
  },
];

const PerencanaanPage = () => {
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
              <span className="text-white">Layanan Perencanaan & Program</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              Layanan Perencanaan & Program
            </h1>
            <p className="text-lg text-white/90 font-light">
              Informasi terkait perencanaan dan Program pendidikan di lingkungan{" "}
              <span className="font-semibold text-white">Dinas Pendidikan Dan Kebudayaan Kota Palu</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <div className="pt-12 max-w-6xl mx-auto px-6">
        <div>
          <h2 className="text-3xl font-bold text-center mb-4">Layanan Perencanaan</h2>
          <p className="text-center text-gray-600 mb-8">
            Layanan ini menyediakan informasi terkait perencanaan pendidikan di lingkungan Dinas Pendidikan Kota Palu.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {layananPerencanaan.map((item, index) => (
                <Link
                  to={item.path}
                  key={index}
                  className="group p-6 bg-white border rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center hover:bg-gray-50 flex flex-col h-[273px]"
                >
                  <div className="mb-4 flex justify-center">{item.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </Link>
              ))}

          </div>

          {/* Kontak Pelayanan */}
          <div className="mt-12 p-6 bg-gray-100 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Kontak Pelayanan</h2>
            <div className="flex flex-col gap-2 text-gray-800">
              <p className="flex items-center gap-2">📞 (0451) 123456</p>
              <p className="flex items-center gap-2">✉️ disdikbud@kotapalu.go.id</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerencanaanPage;
