import {
  FileUp,
  Briefcase,
  Users,
  BadgeCheck,
  ScrollText,
  Phone,
  Mail,
  BarChart3,
  ClipboardList,
  Handshake,
  Stamp,
  Medal,
  GraduationCap,
  PlaneTakeoff,
  FileText,
  BookOpen,
  Megaphone,
  FileSignature,
  UserCog
} from "lucide-react";
import { Link } from 'react-router-dom';

type Layanan = {
  title: string;
  description: string;
  icon: JSX.Element;
  path:string;
};


const KepegawaianPage: Layanan[] = [
  {
    title: "Pelayanan Kenaikan Pangkat Reguler",
    description: "Pengajuan kenaikan pangkat reguler untuk guru dan tenaga kependidikan.",
    icon: <FileUp className="w-10 h-10 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/kenaikan-pangkat",
  },
  {
    title: "Pelayanan Pensiun",
    description: "Prosedur dan pengajuan pensiun termasuk BUP dan pensiun janda/duda.",
    icon: <Briefcase className="w-10 h-10 text-green-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/pensiun",
  },
  {
    title: "Pelayanan Mutasi & Rotasi Pegawai",
    description: "Pengajuan mutasi, rotasi, dan perpindahan guru atau tenaga kependidikan.",
    icon: <Users className="w-10 h-10 text-purple-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/mutasi-rotasi",
  },
  {
    title: "Pelayanan Kartu Pegawai (KARPEG)",
    description: "Permohonan dan pencetakan ulang KARPEG ASN.",
    icon: <BadgeCheck className="w-10 h-10 text-yellow-500 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/kartu-pegawai",
  },
  {
    title: "Pelayanan SK CPNS & PNS",
    description: "Permintaan salinan SK CPNS atau PNS serta legalisasi dokumen kepegawaian.",
    icon: <ScrollText className="w-10 h-10 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/sk-cpns-pns",
  },
  {
    title: "Pelayanan Izin Belajar",
    description: "Pengajuan izin belajar bagi pegawai ASN di lingkungan Dinas Pendidikan.",
    icon: <GraduationCap className="w-10 h-10 text-cyan-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/izin-belajar",
  },
  {
    title: "Pelayanan Cuti, Umroh/Haji, Tahunan, Melahirkan",
    description: "Pengajuan berbagai jenis cuti pegawai, termasuk umroh/haji dan cuti melahirkan.",
    icon: <PlaneTakeoff className="w-10 h-10 text-fuchsia-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/cuti-umroh-haji-melahirkan",
  },
  {
    title: "Pelayanan SK Jabatan Guru",
    description: "Permohonan SK jabatan untuk guru dan tenaga pendidik.",
    icon: <Stamp className="w-10 h-10 text-lime-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/sk-jabatan-guru",
  },
  {
    title: "Pelayanan Pengajuan SK Jabatan Kenaikan Fungsional",
    description: "Pengajuan SK jabatan terkait kenaikan jabatan fungsional.",
    icon: <FileSignature className="w-10 h-10 text-violet-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/sk-jabatan-kenaikan-fungsional",
  },
  {
    title: "Pelayanan Pengajuan Satya Lencana Karya Satya",
    description: "Pengajuan penghargaan Satya Lencana untuk ASN berprestasi.",
    icon: <Medal className="w-10 h-10 text-amber-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/satya-lencana-karya-satya",
  },
  {
    title: "Pelayanan Penerbitan SK Gaji Berkala",
    description: "Proses penerbitan dan pembaruan SK kenaikan gaji berkala ASN.",
    icon: <FileText className="w-10 h-10 text-orange-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/sk-gaji-berkala",
  },
  {
    title: "Pelayanan Pengajuan Mutasi Guru",
    description: "Permohonan mutasi tempat tugas bagi guru.",
    icon: <UserCog className="w-10 h-10 text-rose-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/mutasi-guru",
  },
  {
    title: "Pelayanan Rekomendasi Izin Penelitian",
    description: "Permohonan izin penelitian di lingkungan Dinas Pendidikan.",
    icon: <BookOpen className="w-10 h-10 text-blue-500 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/rekomendasi-izin-penelitian",
  },
  {
    title: "Pelayanan Izin Cerai",
    description: "Pengajuan izin cerai bagi ASN sesuai ketentuan perundang-undangan.",
    icon: <Handshake className="w-10 h-10 text-red-500 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/izin-cerai",
  },
  {
    title: "Pelayanan Pengaduan Masyarakat",
    description: "Penyampaian pengaduan, saran, atau keluhan masyarakat terkait layanan kepegawaian.",
    icon: <Megaphone className="w-10 h-10 text-gray-700 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/pengaduan-masyarakat",
  },
  {
    title: "E-Laporan Kinerja (e-LKP)",
    description: "Pelaporan kinerja secara elektronik untuk ASN Dinas Pendidikan.",
    icon: <ClipboardList className="w-10 h-10 text-teal-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/e-laporan-kinerja",
  },
  {
    title: "Bimbingan Karier",
    description: "Layanan konsultasi karier dan pengembangan profesional pegawai.",
    icon: <BarChart3 className="w-10 h-10 text-pink-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/umum-kepegawaian/layanan/bimbingan-karier",
  },
];


export default function LayananKepegawaian() {
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
              <span className="text-white">Layanan Sub-Bagian Umum Dan Kepegawaian</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              Layanan Sub-Bagian Umum Dan Kepegawaian 
            </h1>
            <p className="text-lg text-white/90 font-light">
              Layanan ini menyediakan informasi sub-bagian umum dan  kepegawaian di lingkungan
              <span className="font-semibold text-white"> Dinas Pendidikan Dan Kebudayaan Kota Palu</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <div className="pt-12 max-w-6xl mx-auto px-6">
        {/* Hapus slider */}

        {/* Layanan Kepegawaian */}
        <div>
          <h2 className="text-3xl font-bold mb-4 text-center">Pelayanan Bidang Kepegawaian</h2>
          <p className="text-gray-600 mb-8 text-center">
            Layanan ini disediakan untuk mendukung manajemen sumber daya manusia di lingkungan Dinas Pendidikan dan Kebudayaan Kota Palu.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KepegawaianPage.map((item, index) => (
              <Link
                key={index}
                to={item.path}
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
