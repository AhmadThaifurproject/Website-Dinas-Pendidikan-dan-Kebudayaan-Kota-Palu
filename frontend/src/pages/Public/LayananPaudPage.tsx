import { Phone, Mail, School, UserPlus, FileText, BookOpen, FileBadge,Wallet,Gift,FileSignature,ShieldCheck,Database,ClipboardCheck, } from "lucide-react";
import { Link } from "react-router-dom";

type Layanan = {
  title: string;
  description: string;
  icon: JSX.Element;
  path: string;
};

const paudServices: Layanan[] = [
  {
    title: "Pendaftaran PAUD",
    description: "Informasi dan pengajuan pendaftaran siswa baru tingkat PAUD.",
    icon: <UserPlus className="w-10 h-10 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/pendaftaran"
  },
  {
    title: "Mutasi Siswa PAUD",
    description: "Prosedur mutasi masuk dan keluar siswa antar lembaga PAUD.",
    icon: <School className="w-10 h-10 text-purple-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/mutasi"
  },
  {
    title: "Data Lembaga PAUD",
    description: "Akses informasi profil lembaga PAUD, akreditasi, dan data lainnya.",
    icon: <BookOpen className="w-10 h-10 text-green-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/data-lembaga"
  },
  {
    title: "Legalisir Ijazah PAUD",
    description: "Layanan legalisir dokumen ijazah secara resmi dari Dinas Pendidikan.",
    icon: <FileText className="w-10 h-10 text-yellow-500 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/legalisir-ijazah"
  },
  {
    title: "Surat Keterangan Ijazah Rusak / Hilang",
    description: "Permohonan surat pengganti karena ijazah rusak atau hilang.",
    icon: <FileBadge className="w-10 h-10 text-red-500 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/suket"
  },
  {
    title: "Rekomendasi Pendirian Lembaga Pendidikan",
    description: "Pelayanan rekomendasi pendirian lembaga pendidikan keterampilan/kursus.",
    icon: <ShieldCheck className="w-10 h-10 text-blue-500 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/rekomendasi-pendirian"
  },
  {
    title: "Data Pokok Pendidikan PAUD dan PNF",
    description: "Pelayanan data pokok pendidikan untuk PAUD dan Pendidikan Non Formal.",
    icon: <Database className="w-10 h-10 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/dapodik"
  },
  {
    title: "Izin Pendirian dan Penyelenggaraan",
    description: "Pelayanan izin pendirian dan operasional lembaga PAUD dan PNF.",
    icon: <ClipboardCheck className="w-10 h-10 text-emerald-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/izin-pendirian"
  },
  {
    title: "Dana BOS untuk Satuan Pendidikan",
    description: "Pelayanan kepada satuan pendidikan terkait dana BOS.",
    icon: <Wallet className="w-10 h-10 text-pink-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/dana-bos"
  },
  {
    title: "Dana Alokasi Khusus (DAK)",
    description: "Pelayanan kepada lembaga penerima Dana Alokasi Khusus (DAK).",
    icon: <Gift className="w-10 h-10 text-teal-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/dak"
  },
  {
    title: "Legalisir SKHU Paket A, B, C",
    description: "Pelayanan legalisir surat keterangan hasil ujian Paket A, B, dan C.",
    icon: <FileSignature className="w-10 h-10 text-gray-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/legalisir-skhu"
  },
  {
    title: "Bantuan Operasional Sekolah (BOS)",
    description: "Pelayanan program BOS untuk lembaga PAUD dan Non Formal.",
    icon: <Wallet className="w-10 h-10 text-teal-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/paud/layanan/bos"
  }
];



export default function LayananPaudPage() {
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
              <span className="text-white">Layanan PAUD&PNF</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              Layanan  <br className="hidden md:block" /> PAUD & PNF Kota Palu
            </h1>
            <p className="text-lg text-white/90 font-light">
              Temukan layanan pendidikan PAUD secara digital yang disediakan oleh
              <span className="font-semibold text-white"> Dinas Pendidikan dan Kebudayaan Kota Palu</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <div className="pt-12 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4 text-center">Pelayanan Bidang PAUD</h2>
        <p className="text-gray-600 mb-8 text-center">
          Layanan PAUD bertujuan untuk memberikan kemudahan akses informasi dan pengajuan layanan terkait Pendidikan Anak Usia Dini (PAUD).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paudServices.map((item, index) => (
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
  );
}
