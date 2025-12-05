import { Phone, Mail, BadgePercent, Briefcase, Repeat, CreditCard, FileText, CalendarDays, UserCheck, ClipboardList,GraduationCap,Contact2 } from "lucide-react";
import { Link } from "react-router-dom";

type Layanan = {
  title: string;
  description: string;
  icon: JSX.Element;
  path:string;
};

const KepegawaianPage: Layanan[] = [
  {
    title: "Layanan Kenaikan Pangkat",
    description: "Pengajuan kenaikan pangkat guru dan staf tata usaha berdasarkan ketentuan yang berlaku.",
    icon: <BadgePercent className="w-10 h-10 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/ketenagaan-gtk/layanan/kenaikan-pangkat",
  },
  {
    title: "Layanan Pensiun",
    description: "Prosedur dan pengajuan pensiun bagi ASN di lingkungan Dinas Pendidikan.",
    icon: <Briefcase className="w-10 h-10 text-green-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/ketenagaan-gtk/layanan/pensiun",
  },
  {
    title: "Mutasi & Rotasi Pegawai",
    description: "Proses pengajuan mutasi atau rotasi bagi tenaga pendidik dan kependidikan.",
    icon: <Repeat className="w-10 h-10 text-purple-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/ketenagaan-gtk/layanan/mutasi-rotasi",
  },
  {
    title: "Kartu Pegawai (KARPEG)",
    description: "Permohonan dan pencetakan ulang KARPEG ASN.",
    icon: <CreditCard className="w-10 h-10 text-orange-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/ketenagaan-gtk/layanan/kartu-pegawai",
  },
  {
    title: "SK CPNS & PNS",
    description: "Permintaan salinan SK CPNS atau PNS serta pengesahan dokumen kepegawaian.",
    icon: <FileText className="w-10 h-10 text-amber-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/ketenagaan-gtk/layanan/skcpns-pns",
  },
  {
    title: "Cuti Pegawai",
    description: "Pengajuan dan verifikasi cuti tahunan, cuti besar, maupun cuti lainnya.",
    icon: <CalendarDays className="w-10 h-10 text-rose-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/ketenagaan-gtk/layanan/cuti-pegawai",
  },
  {
    title: "Bimbingan Karier",
    description: "Layanan konsultasi karier dan pengembangan profesional pegawai.",
    icon: <UserCheck className="w-10 h-10 text-sky-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/ketenagaan-gtk/layanan/bimbingan-karier",
  },
  {
    title: "E-Laporan Kinerja (e-LKP)",
    description: "Pelaporan kinerja secara elektronik untuk ASN Dinas Pendidikan.",
    icon: <ClipboardList className="w-10 h-10 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/ketenagaan-gtk/layanan/elkp",
  },
  {
    title: "Pelayanan Sertifikasi Tenaga Pendidik",
    description: "Layanan pengajuan dan informasi sertifikasi bagi guru dan tenaga pendidik.",
    icon: <GraduationCap className="w-10 h-10 text-lime-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/ketenagaan-gtk/layanan/sertifikasi-pendidik",
  },
  {
    title: "Pelayanan Pengajuan NUPTK",
    description: "Pengajuan Nomor Unik Pendidik dan Tenaga Kependidikan (NUPTK).",
    icon: <Contact2 className="w-10 h-10 text-pink-600 group-hover:text-indigo-700 transition-colors duration-300" />,
    path: "/ketenagaan-gtk/layanan/nuptk",
  },
];


export default function LayananSMP() {
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
              <span className="text-white">Layanan Ketenagaan Dan GTK</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              Layanan Ketenagaan & GTK
            </h1>
            <p className="text-lg text-white/90 font-light">
              Layanan ini menyediakan informasi terkait ketenagaan dan GTK di lingkungan
              <span className="font-semibold text-white"> Dinas Pendidikan Dan Kebudayaan Kota Palu</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <div className="pt-12 max-w-6xl mx-auto px-6">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-center">Pelayanan Bidang Ketenagaan</h2>
          <p className="text-gray-600 mb-8 text-center">
            Layanan ini disediakan untuk mendukung manajemen sumber daya manusia di lingkungan Dinas Pendidikan dan Kebudayaan Kota Palu.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KepegawaianPage.map((item, index) => (
              <Link
                to={item.path}
                key={index}
                className="group p-6 bg-white border rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center hover:bg-gray-50 flex flex-col h-[250px] no-underline"
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
