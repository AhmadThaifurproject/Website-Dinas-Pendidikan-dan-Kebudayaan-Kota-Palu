import { Link } from "react-router-dom";
import LayananViewer from "../../../Components/LayananViewer";
import { FileText, Calendar, ClipboardList } from "lucide-react";

export default function LayananBOS() {
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
              <span className="text-white">Bantuan Operasional Sekolah</span>
            </div>

            {/* Judul Banner */}
            <h1 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
              Dokumen Bantuan Operasional <br className="hidden md:block" /> Sekolah (BOS)
            </h1>

            {/* Deskripsi Banner */}
            <p className="text-lg text-white/90 font-light">
              Informasi lengkap mengenai{" "}
              <span className="font-semibold text-white">
                penyaluran dan penggunaan dana BOS
              </span>{" "}
              untuk sekolah di Kota Palu sesuai peraturan terbaru.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <LayananViewer
        judul="Dokumen Bantuan Operasional Sekolah (BOS)"
        deskripsi="Dokumen terkait penyaluran dan penggunaan dana BOS."
        endpoint="http://localhost:8000/api/sd/upload/bos"
        cards={[
          {
            icon: <FileText size={36} />,
            title: "Petunjuk Teknis",
            description:
              "Panduan teknis penggunaan dana BOS sesuai peraturan terbaru.",
          },
          {
            icon: <ClipboardList size={36} />,
            title: "Laporan Realisasi",
            description:
              "Laporan pertanggungjawaban penggunaan dana BOS setiap semester.",
          },
          {
            icon: <Calendar size={36} />,
            title: "Jadwal Penyaluran",
            description:
              "Jadwal resmi penyaluran dana BOS dari pemerintah.",
          },
        ]}
      />
    </div>
  );
}
