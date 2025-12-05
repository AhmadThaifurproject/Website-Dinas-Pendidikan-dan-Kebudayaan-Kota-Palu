import {
  Phone,
  Mail,
  School,
  Repeat,
  Database,
  DollarSign,
  Hammer,
  FileText,
  FileX2,
  FileBadge,
} from "lucide-react";
import { Link } from "react-router-dom";

type Layanan = {
  title: string;
  description: string;
  icon: JSX.Element;
  path: string;
};

const SdPage: Layanan[] = [
  {
    title: "Penerimaan Peserta Didik Baru (PPDB)",
    description: "Informasi dan pengajuan pendaftaran siswa baru tingkat SD di Kota.",
    icon: <School className="w-10 h-10 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/sd/layanan/ppdb",
  },
  {
    title: "Mutasi Siswa",
    description: "Prosedur mutasi masuk dan keluar siswa antar sekolah tingkat SD.",
    icon: <Repeat className="w-10 h-10 text-purple-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/sd/layanan/mutasi-siswa",
  },
  {
    title: "Data Sekolah",
    description: "Akses informasi profil sekolah SD, akreditasi, dan data pendukung lainnya.",
    icon: <Database className="w-10 h-10 text-green-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/sd/layanan/data-sekolah",
  },
  {
    title: "Bantuan Operasional Sekolah (BOS)",
    description: "Informasi pengajuan dan pelaporan dana BOS untuk sekolah tingkat SD.",
    icon: <DollarSign className="w-10 h-10 text-yellow-500 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/sd/layanan/bos",
  },
  {
    title: "Pengajuan Sarana & Prasarana",
    description: "Layanan permohonan bantuan fasilitas untuk sekolah SD.",
    icon: <Hammer className="w-10 h-10 text-red-500 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/sd/layanan/sapras",
  },
  {
    title: "Legalisir Ijazah",
    description: "Layanan legalisir dokumen ijazah secara resmi dari Dinas Pendidikan.",
    icon: <FileText className="w-10 h-10 text-fuchsia-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/sd/layanan/legalisir",
  },
  {
    title: "Surat Keterangan Ijazah Rusak / Kesalahan",
    description: "Permohonan surat pengganti karena ijazah rusak atau kesalahan penulisan.",
    icon: <FileX2 className="w-10 h-10 text-orange-500 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/sd/layanan/suket",
  },
  {
    title: "Pelayanan Surat Pengganti Ijazah",
    description: "Ajukan surat pengganti jika ijazah hilang atau tidak dapat digunakan.",
    icon: <FileBadge className="w-10 h-10 text-teal-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/sd/layanan/suket-gantijazah",
  },
];

export default function LayananSDPage() {
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
              <span className="text-white">Layanan Siswa</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              Layanan SD
            </h1>
            <p className="text-lg text-white/90 font-light">
              Layanan ini menyediakan informasi dan permohonan pelayanan untuk jenjang{" "}
              <span className="font-semibold text-white">Sekolah Dasar di Kota Palu</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <div className="pt-12 max-w-6xl mx-auto px-6">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-center">Pelayanan SD</h2>
          <p className="text-gray-600 mb-8 text-center">
            Berikut adalah berbagai layanan yang tersedia untuk sekolah dasar melalui Dinas Pendidikan dan Kebudayaan Kota Palu.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SdPage.map((item, index) => (
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
