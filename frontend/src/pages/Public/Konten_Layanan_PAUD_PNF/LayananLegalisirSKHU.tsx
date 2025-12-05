import { Link } from "react-router-dom";
import LayananViewer from "../../../Components/LayananViewer";
import { FileText, PenTool, ClipboardCheck } from "lucide-react";

export default function LayananLegalisirSKHU() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Banner / Hero Section */}
      <section className="relative h-[50vh] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">
        {/* Overlay gelap + blur */}
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
              <span className="text-white">Legalisir SKHU Paket A, B, C</span>
            </div>

            {/* Judul Banner */}
            <h1 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
              Layanan Legalisir <br className="hidden md:block" />
              SKHU Paket A, B, dan C
            </h1>

            {/* Deskripsi Banner */}
            <p className="text-lg text-white/90 font-light">
              Informasi lengkap mengenai{" "}
              <span className="font-semibold text-white">
                proses legalisir Surat Keterangan Hasil Ujian (SKHU) Paket A, B, dan C
              </span>{" "}
              secara resmi dari Dinas Pendidikan sesuai ketentuan terbaru.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <LayananViewer
        judul="Legalisir SKHU Paket A, B, C"
        deskripsi="Pelayanan legalisir surat keterangan hasil ujian Paket A, B, dan C."
        endpoint="http://localhost:8000/api/paud/upload/legalisir-skhu"
        cards={[
          {
            icon: <FileText size={36} />,
            title: "Formulir Legalisir",
            description: "Permohonan legalisir SKHU dengan format resmi.",
          },
          {
            icon: <PenTool size={36} />,
            title: "Prosedur Legalisir",
            description: "Alur proses dan waktu legalisir SKHU.",
          },
          {
            icon: <ClipboardCheck size={36} />,
            title: "Syarat Dokumen",
            description: "Dokumen asli dan salinan yang dibutuhkan.",
          },
        ]}
      />
    </div>
  );
}
