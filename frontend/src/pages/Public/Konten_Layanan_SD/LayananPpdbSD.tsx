import { Link } from "react-router-dom";
import LayananViewer from "../../../Components/LayananViewer";
import { FileText, Calendar, ClipboardList } from "lucide-react";

export default function LayananPPDBPage() {
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
              <span className="text-white">Informasi PPDB</span>
            </div>

            {/* Judul Banner */}
            <h1 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
              Penerimaan Peserta Didik Baru (PPDB)
            </h1>

            {/* Deskripsi Banner */}
            <p className="text-lg text-white/90 font-light">
              Berikut ini adalah{" "}
              <span className="font-semibold text-white">
                dokumen resmi dan informasi penting terkait proses PPDB
              </span>{" "}
              untuk tingkat SD di Kota Palu.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <LayananViewer
        judul="Preview Dokumen / Gambar PPDB"
        deskripsi="Berikut ini adalah dokumen resmi PPDB yang dapat dilihat dan diunduh."
        endpoint="http://localhost:8000/api/smp/upload/ppdb"
        cards={[
          {
            icon: <FileText size={36} />,
            title: "Alur Pendaftaran",
            description:
              "Tahapan pendaftaran siswa baru mulai dari pembuatan akun hingga pengumuman hasil seleksi.",
          },
          {
            icon: <Calendar size={36} />,
            title: "Jadwal PPDB",
            description:
              "Informasi tanggal pembukaan pendaftaran, verifikasi berkas, seleksi, dan pengumuman hasil.",
          },
          {
            icon: <ClipboardList size={36} />,
            title: "Persyaratan",
            description:
              "Syarat usia, dokumen yang dibutuhkan, dan ketentuan zonasi untuk siswa baru tingkat SMP.",
          },
        ]}
      />
    </div>
  );
}
