import { Link } from "react-router-dom";
import LayananViewer from "../../../Components/LayananViewer";
import { FileBadge, FileWarning, FileText } from "lucide-react";

export default function LayananSuketPaud() {
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
              <span className="text-white">
                Surat Keterangan Ijazah Rusak / Hilang
              </span>
            </div>

            {/* Judul Banner */}
            <h1 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
              Layanan Surat Keterangan <br className="hidden md:block" />
              Ijazah Rusak / Hilang
            </h1>

            {/* Deskripsi Banner */}
            <p className="text-lg text-white/90 font-light">
              Informasi lengkap mengenai{" "}
              <span className="font-semibold text-white">
                proses dan persyaratan penerbitan surat keterangan pengganti
                ijazah yang rusak atau hilang
              </span>{" "}
              secara resmi dari Dinas Pendidikan sesuai ketentuan terbaru.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <LayananViewer
        judul="Surat Keterangan Ijazah Rusak / Hilang"
        deskripsi="Permohonan surat pengganti karena ijazah rusak atau hilang."
        endpoint="http://localhost:8000/api/paud/upload/suket-paud"
        cards={[
          {
            icon: <FileBadge size={36} />,
            title: "Formulir Permohonan",
            description: "Dokumen resmi pengajuan surat keterangan pengganti ijazah.",
          },
          {
            icon: <FileWarning size={36} />,
            title: "Surat Pernyataan",
            description: "Surat yang menyatakan kerusakan atau kehilangan ijazah.",
          },
          {
            icon: <FileText size={36} />,
            title: "Prosedur Penerbitan",
            description: "Alur penerbitan surat pengganti oleh Dinas Pendidikan.",
          },
        ]}
      />
    </div>
  );
}
