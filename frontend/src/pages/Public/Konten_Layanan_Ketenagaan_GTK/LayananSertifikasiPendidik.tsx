import LayananViewer from "../../../Components/LayananViewer";
import { BadgeCheck, FileText, BookOpen } from "lucide-react";

export default function LayananSertifikasiPendidik() {
  return (
    <LayananViewer
      judul="Pelayanan Sertifikasi Tenaga Pendidik"
      deskripsi="Layanan pengajuan dan informasi sertifikasi bagi guru dan tenaga pendidik."
      endpoint="http://localhost:8000/api/kepegawaian/sertifikasi"
      cards={[
        {
          icon: <BadgeCheck size={36} />,
          title: "Pengajuan Sertifikasi",
          description: "Persyaratan dan alur pengajuan sertifikasi pendidik.",
        },
        {
          icon: <FileText size={36} />,
          title: "Verifikasi Dokumen",
          description: "Proses seleksi dan pengecekan kelengkapan data.",
        },
        {
          icon: <BookOpen size={36} />,
          title: "Pelatihan Sertifikasi",
          description: "Informasi pelaksanaan pelatihan dan uji kompetensi.",
        },
      ]}
    />
  );
}
