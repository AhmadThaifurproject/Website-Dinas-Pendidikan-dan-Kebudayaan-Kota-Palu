import {
  Phone,
  Mail,
  School,
  Repeat,
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  FileWarning,
  FileSearch,
} from "lucide-react";
import { Link } from "react-router-dom";

type Layanan = {
  title: string;
  description: string;
  icon: JSX.Element;
};

const SmpPage: Layanan[] = [
  {
    title: "Penerimaan Peserta Didik Baru (PPDB)",
    description: "Informasi dan pengajuan pendaftaran siswa baru tingkat SMP di Kota.",
    icon: <School className="w-10 h-10 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" />,
  },
  {
    title: "Mutasi Siswa",
    description: "Prosedur mutasi masuk dan keluar siswa antar sekolah tingkat SMP.",
    icon: <Repeat className="w-10 h-10 text-green-600 group-hover:text-indigo-700 transition-colors duration-300" />,
  },
  {
    title: "Data Sekolah",
    description: "Akses informasi profil sekolah SMP, akreditasi, dan data pendukung lainnya.",
    icon: <BookOpen className="w-10 h-10 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" />,
  },
  {
    title: "Bantuan Operasional Sekolah (BOS)",
    description: "Informasi pengajuan dan pelaporan dana BOS untuk sekolah tingkat SMP.",
    icon: <Briefcase className="w-10 h-10 text-yellow-600 group-hover:text-indigo-700 transition-colors duration-300" />,
  },
  {
    title: "Pengajuan Sarana & Prasarana",
    description: "Layanan permohonan bantuan fasilitas untuk sekolah SMP.",
    icon: <Building2 className="w-10 h-10 text-pink-600 group-hover:text-indigo-700 transition-colors duration-300" />,
  },
  {
    title: "Legalisir Ijazah",
    description: "Layanan legalisir dokumen ijazah secara resmi dari Dinas Pendidikan.",
    icon: <FileText className="w-10 h-10 text-purple-600 group-hover:text-indigo-700 transition-colors duration-300" />,
  },
  {
    title: "Surat Keterangan Ijazah Rusak / Kesalahan",
    description: "Permohonan surat pengganti karena ijazah rusak atau kesalahan penulisan.",
    icon: <FileWarning className="w-10 h-10 text-red-600 group-hover:text-indigo-700 transition-colors duration-300" />,
  },
  {
    title: "Pelayanan Surat Pengganti Ijazah",
    description: "Ajukan surat pengganti jika ijazah hilang atau tidak dapat digunakan.",
    icon: <FileSearch className="w-10 h-10 text-orange-600 group-hover:text-indigo-700 transition-colors duration-300" />,
  },
];

export default function LayananSMP() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[45vh] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
  
        {/* Konten dibungkus div ini */}
        <div className="relative z-10 h-full flex items-start px-10 md:px-24 pt-20 md:pt-24"> 
          {/* pt-20 (5rem) bikin konten turun dari atas, tapi bg tetap penuh di atas */}
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
              Layanan Siswa <br className="hidden md:block" /> Tingkat SMP
            </h1>
            <p className="text-lg text-white/90 font-light">
              Akses layanan digital untuk kebutuhan siswa SMP di bawah naungan
              <span className="font-semibold text-white"> Dinas Pendidikan Kota Palu</span>.
            </p>
          </div>
        </div>
      </section>
      {/* Konten utama */}
      <div className="pt-12 max-w-6xl mx-auto px-6">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-center">Pelayanan untuk Siswa SMP</h2>
          <p className="text-gray-600 mb-8 text-center">
            Layanan berikut ditujukan untuk mendukung kebutuhan administrasi dan informasi siswa tingkat SMP.
          </p>

          {/* Grid Card with Routing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SmpPage.map((item, index) => {
              const titleToPathMap: { [key: string]: string } = {
                "Penerimaan Peserta Didik Baru (PPDB)": "/layanan/ppdb",
                "Mutasi Siswa": "/layanan/mutasi-siswa",
                "Data Sekolah": "/layanan/data-sekolah",
                "Bantuan Operasional Sekolah (BOS)": "/layanan/bos",
                "Pengajuan Sarana & Prasarana": "/layanan/sapras",
                "Legalisir Ijazah": "/layanan/legalisir",
                "Surat Keterangan Ijazah Rusak / Kesalahan": "/layanan/suket",
                "Pelayanan Surat Pengganti Ijazah": "/layanan/suket-gantijazah",
              };

              return (
                <Link key={index} to={titleToPathMap[item.title] || "#"} className="block">
                  <div className="group p-6 bg-white border rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center hover:bg-gray-50 h-[250px] flex flex-col">
                    <div className="mb-4 flex justify-center">{item.icon}</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </Link>
              );
            })}
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
