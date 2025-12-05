import { Link } from "react-router-dom";
import LayananViewer from "../../../Components/LayananViewer";
import { FileSignature, ShieldCheck, CalendarCheck2 } from "lucide-react";

export default function LayananIzinPendirian() {
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
              <span className="text-white">Izin Pendirian & Penyelenggaraan</span>
            </div>

            {/* Judul Banner */}
            <h1 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
              Izin Pendirian dan <br className="hidden md:block" />
              Penyelenggaraan Lembaga PAUD & PNF
            </h1>

            {/* Deskripsi Banner */}
            <p className="text-lg text-white/90 font-light">
              Informasi lengkap mengenai{" "}
              <span className="font-semibold text-white">
                proses dan persyaratan izin pendirian serta penyelenggaraan
                lembaga PAUD dan Pendidikan Non Formal
              </span>{" "}
              sesuai ketentuan terbaru.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <LayananViewer
        judul="Izin Pendirian dan Penyelenggaraan"
        deskripsi="Pelayanan izin pendirian dan operasional lembaga PAUD dan PNF."
        endpoint="http://localhost:8000/api/paud/upload/izin-pendirian"
        cards={[
          {
            icon: <FileSignature size={36} />,
            title: "Surat Permohonan",
            description: "Formulir dan format surat permohonan izin pendirian.",
          },
          {
            icon: <ShieldCheck size={36} />,
            title: "Persyaratan Legal",
            description: "Ketentuan dan dokumen legal yang harus disiapkan.",
          },
          {
            icon: <CalendarCheck2 size={36} />,
            title: "Jadwal Proses",
            description: "Waktu proses hingga terbitnya izin operasional.",
          },
        ]}
      />
    </div>
  );
}
