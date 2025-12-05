import { Link } from "react-router-dom";
import LayananViewer from "../../../Components/LayananViewer";
import { FileText, ClipboardList, Calendar } from "lucide-react";

export default function LayananDataSekolah() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Banner / Hero Section */}
      <section className="relative h-[50vh] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />

        <div className="relative z-10 h-full flex items-start px-10 md:px-24 pt-20 md:pt-24">
          <div className="max-w-2xl">
            <div className="w-20 h-1 bg-yellow-300 mb-4"></div>

            {/* Breadcrumb */}
            <div className="text-sm text-yellow-300 mb-2 tracking-widest uppercase">
              <Link to="/" className="hover:underline text-white font-medium">
                Beranda
              </Link>
              <span className="mx-1">/</span>
              <span className="text-white">Data Sekolah</span>
            </div>

            {/* Judul Banner */}
            <h1 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
              Data & Statistik Resmi <br className="hidden md:block" /> Sekolah Kota Palu
            </h1>

            {/* Deskripsi Banner */}
            <p className="text-lg text-white/90 font-light">
              Informasi lengkap mengenai{" "}
              <span className="font-semibold text-white">profil, jumlah siswa, dan data tahunan</span>{" "}
              dari seluruh sekolah di wilayah Kota Palu.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <LayananViewer
        judul="Data Sekolah"
        deskripsi="Data dan statistik resmi sekolah di wilayah Kota Palu."
        endpoint="http://localhost:8000/api/smp/upload/datasekolah"
        cards={[
          {
            icon: <FileText size={36} />,
            title: "Profil Sekolah",
            description: "Informasi umum tentang setiap sekolah di Kota Palu.",
          },
          {
            icon: <ClipboardList size={36} />,
            title: "Jumlah Siswa",
            description: "Jumlah siswa aktif per jenjang pendidikan.",
          },
          {
            icon: <Calendar size={36} />,
            title: "Data Tahunan",
            description: "Rekap data pendidikan berdasarkan tahun ajaran.",
          },
        ]}
      />
    </div>
  );
}
