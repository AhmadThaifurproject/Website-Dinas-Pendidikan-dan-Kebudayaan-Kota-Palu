import { Link } from "react-router-dom";
import LayananViewer from "../../../Components/LayananViewer";
import { ClipboardList, FileText, Calendar } from "lucide-react";

export default function LayananSuket() {
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
              <span className="text-white">Surat Keterangan</span>
            </div>

            {/* Judul Banner */}
            <h1 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
              Surat Keterangan <br className="hidden md:block" /> Sekolah
            </h1>

            {/* Deskripsi Banner */}
            <p className="text-lg text-white/90 font-light">
              Informasi dan{" "}
              <span className="font-semibold text-white">
                template resmi surat keterangan sekolah
              </span>{" "}
              seperti surat aktif sekolah, pindah, dan lainnya.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <LayananViewer
        judul="Surat Keterangan Sekolah"
        deskripsi="Informasi dan template resmi surat keterangan sekolah."
        endpoint="http://localhost:8000/api/smp/upload/suket"
        cards={[
          {
            icon: <ClipboardList size={36} />,
            title: "Jenis Suket",
            description:
              "Jenis surat keterangan yang tersedia seperti aktif sekolah, pindah, dll.",
          },
          {
            icon: <FileText size={36} />,
            title: "Contoh Format",
            description: "Template surat yang bisa diunduh oleh sekolah.",
          },
          {
            icon: <Calendar size={36} />,
            title: "Masa Berlaku",
            description: "Informasi tentang validitas surat keterangan.",
          },
        ]}
      />
    </div>
  );
}
