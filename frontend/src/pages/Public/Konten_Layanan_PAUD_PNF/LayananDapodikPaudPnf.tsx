import { Link } from "react-router-dom";
import LayananViewer from "../../../Components/LayananViewer";
import { Database, BarChart2, FileText } from "lucide-react";

export default function LayananDapodikPaudPnf() {
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
              <span className="text-white">Dapodik PAUD & PNF</span>
            </div>

            {/* Judul Banner */}
            <h1 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
              Data Pokok Pendidikan (Dapodik) <br className="hidden md:block" />
              PAUD & Pendidikan Non Formal
            </h1>

            {/* Deskripsi Banner */}
            <p className="text-lg text-white/90 font-light">
              Informasi lengkap mengenai{" "}
              <span className="font-semibold text-white">
                pengelolaan dan pemutakhiran Data Pokok Pendidikan (Dapodik)
              </span>{" "}
              untuk lembaga PAUD dan Pendidikan Non Formal.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <LayananViewer
        judul="Data Pokok Pendidikan PAUD dan PNF"
        deskripsi="Pelayanan data pokok pendidikan untuk PAUD dan Pendidikan Non Formal."
        endpoint="http://localhost:8000/api/paud/upload/dapodik-paud-pnf"
        cards={[
          {
            icon: <Database size={36} />,
            title: "Akses Dapodik",
            description: "Informasi cara akses dan update data pokok pendidikan.",
          },
          {
            icon: <BarChart2 size={36} />,
            title: "Monitoring Data",
            description: "Pemantauan kelengkapan dan validitas data satuan pendidikan.",
          },
          {
            icon: <FileText size={36} />,
            title: "Laporan Berkala",
            description: "Dokumen rekap data untuk pelaporan berkala.",
          },
        ]}
      />
    </div>
  );
}
