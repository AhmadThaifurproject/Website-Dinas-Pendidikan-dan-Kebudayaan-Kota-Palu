import { Link } from "react-router-dom";
import LayananViewer from "../../../Components/LayananViewer";
import { School, BadgeCheck, BookOpen } from "lucide-react";

export default function LayananDataLembagaPaud() {
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
              <span className="text-white">Data Lembaga PAUD</span>
            </div>

            {/* Judul Banner */}
            <h1 className="text-4xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-4">
              Data Lembaga <br className="hidden md:block" />
              Pendidikan Anak Usia Dini (PAUD)
            </h1>

            {/* Deskripsi Banner */}
            <p className="text-lg text-white/90 font-light">
              Informasi lengkap mengenai{" "}
              <span className="font-semibold text-white">
                profil, akreditasi, dan data operasional lembaga PAUD
              </span>{" "}
              yang terdaftar sesuai peraturan terbaru.
            </p>
          </div>
        </div>
      </section>

      {/* Konten utama */}
      <LayananViewer
        judul="Data Lembaga PAUD"
        deskripsi="Akses informasi profil lembaga PAUD, akreditasi, dan data lainnya."
        endpoint="http://localhost:8000/api/paud/upload/data-lembaga-paud"
        cards={[
          {
            icon: <School size={36} />,
            title: "Profil Lembaga",
            description: "Identitas dan informasi dasar lembaga PAUD.",
          },
          {
            icon: <BadgeCheck size={36} />,
            title: "Status Akreditasi",
            description: "Informasi status dan nilai akreditasi lembaga PAUD.",
          },
          {
            icon: <BookOpen size={36} />,
            title: "Data Operasional",
            description:
              "Data tenaga pendidik, siswa, dan fasilitas lembaga PAUD.",
          },
        ]}
      />
    </div>
  );
}
