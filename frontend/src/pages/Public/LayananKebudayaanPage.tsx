import { 
  Landmark,
  Phone,
  Mail, 
  Home, 
  Twitter, 
  MapPin, 
  ListChecks, 
  Hash, 
  Search, 
  Globe 
} from "lucide-react";
import { Link } from "react-router-dom";

type Layanan = {
  title: string;
  description: string;
  icon: JSX.Element;
  path:string;

};

const layananKebudayaan: Layanan[] = [
  {
    title: "Pelayanan Prosedur Permohonan Izin Berkunjung ke Cagar Budaya",
    description: "Panduan dan prosedur pengajuan izin untuk berkunjung ke situs cagar budaya.",
    path: "/kebudayaan/layanan/izin-berkunjung",
    icon: (
      <Landmark className="w-10 h-10 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300" />
    ),
  },
  {
    title: "Pelayanan Prosedur Penggunaan Halaman Cagar Budaya",
    description: "Aturan dan tata cara penggunaan halaman dan fasilitas cagar budaya.",
    path: "/kebudayaan/layanan/penggunaan-halaman",
    icon: (
      <Home className="w-10 h-10 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" />
    ),
  },
  {
    title: "Pelayanan Data dan Informasi Cagar Budaya melalui Media Sosial",
    description: "Penyebaran informasi dan data terkait cagar budaya melalui platform media sosial.",
    path: "/Kebudayaan/layanan/informasi-sosial",
    icon: (
      <Twitter className="w-10 h-10 text-cyan-600 group-hover:text-indigo-700 transition-colors duration-300" />
    ),
  },
  {
    title: "Pelayanan Data dan Informasi Cagar Budaya Secara Langsung di Kantor",
    description: "Layanan informasi dan data cagar budaya secara tatap muka di kantor kebudayaan.",
    path: "/kebudayaan/layanan/informasi-kantor",
    icon: (
      <MapPin className="w-10 h-10 text-green-600 group-hover:text-indigo-700 transition-colors duration-300" />
    ),
  },
  {
    title: "Pelaksanaan Pendataan Cagar Budaya",
    description: "Proses pendataan dan inventarisasi situs dan benda cagar budaya.",
    path: "/kebudayaan/layanan/pendataan",
    icon: (
      <ListChecks className="w-10 h-10 text-yellow-600 group-hover:text-indigo-700 transition-colors duration-300" />
    ),
  },
  {
    title: "Pelayanan Nomor Induk Kebudayaan Kategori Cagar Budaya",
    description: "Penerbitan dan pengelolaan Nomor Induk untuk kategori cagar budaya.",
    path: "/kebudayaan/layanan/nomor-induk",
    icon: (
      <Hash className="w-10 h-10 text-orange-600 group-hover:text-indigo-700 transition-colors duration-300" />
    ),
  },
  {
    title: "Penemuan Objek Diduga Cagar Budaya",
    description: "Pelaporan dan penanganan penemuan benda atau situs yang diduga cagar budaya.",
    path: "/kebudayaan/layanan/penemuan-objek",
    icon: (
      <Search className="w-10 h-10 text-red-600 group-hover:text-indigo-700 transition-colors duration-300" />
    ),
  },
  {
    title: "Pengembangan Situs Cagar Budaya",
    description: "Upaya pelestarian dan pengembangan situs cagar budaya agar terjaga dan dimanfaatkan.",
    path: "/kebudayaan/layanan/pengembangan-situs",
    icon: (
      <Globe className="w-10 h-10 text-purple-600 group-hover:text-indigo-700 transition-colors duration-300" />
    ),
  },
];


export default function LayananKebudayaanPage() {
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
              <span className="text-white">Layanan Kebudayaan</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              Layanan Kebudayaan
            </h1>
            <p className="text-lg text-white/90 font-light">
              Informasi dan layanan terkait pelestarian serta pengembangan budaya di lingkungan{" "}
              <span className="font-semibold text-white">Dinas Pendidikan Kota Palu</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Konten Utama */}
      <div className="pt-12 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4">Pelayanan Bidang Kebudayaan</h2>
        <p className="text-center text-gray-600 mb-8">
          Layanan ini disediakan untuk mendukung pelestarian dan pengembangan kebudayaan daerah.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {layananKebudayaan.map((item, index) => {
            const content = (
              <div
                key={index}
                className="group p-6 bg-white border rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center hover:bg-gray-50 flex flex-col h-[273px]"
              >
                <div className="mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            );

            return item.path ? (
              <Link to={item.path} key={index}>
                {content}
              </Link>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </div>

        {/* Kontak Pelayanan */}
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
