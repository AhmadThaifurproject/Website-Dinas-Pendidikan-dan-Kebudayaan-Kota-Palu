import { Link } from "react-router-dom";
import LayananViewer from "../../../Components/LayananViewer";
import { ClipboardList, FileText, Calendar } from "lucide-react";

export default function LayananLegalisir() {
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
              <span className="text-white">Legalisir Ijazah</span>
            </div>

            {/* Judul Banner */}
            <h1 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
              Layanan Legalisir <br className="hidden md:block" /> Ijazah
            </h1>

            {/* Deskripsi Banner */}
            <p className="text-lg text-white/90 font-light">
              Informasi lengkap mengenai{" "}
              <span className="font-semibold text-white">prosedur dan dokumen yang dibutuhkan</span>{" "}
              untuk proses legalisir ijazah di Dinas Pendidikan Kota Palu.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <LayananViewer
        judul="Layanan Legalisir Ijazah"
        deskripsi="Panduan dan dokumen terkait proses legalisir ijazah."
        endpoint="http://localhost:8000/api/smp/upload/legalisir"
        cards={[
          {
            icon: <ClipboardList size={36} />,
            title: "Syarat Legalisir",
            description: "Dokumen yang dibutuhkan untuk legalisir ijazah.",
          },
          {
            icon: <FileText size={36} />,
            title: "Formulir Pengajuan",
            description: "Formulir yang harus diisi oleh pemohon legalisir.",
          },
          {
            icon: <Calendar size={36} />,
            title: "Waktu Pelayanan",
            description: "Waktu pelayanan dan estimasi waktu penyelesaian legalisir.",
          },
        ]}
      />
    </div>
  );
}
