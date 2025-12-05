import LayananViewer from "../../../Components/LayananViewer";
import { SearchCheck } from "lucide-react";

export default function LayananRekomendasiIzinPenelitian() {
  return (
    <LayananViewer
      judul="Rekomendasi Izin Penelitian"
      deskripsi="Permohonan izin penelitian di lingkungan Dinas Pendidikan."
      endpoint="http://localhost:8000/api/kepegawaian/upload/izinpenelitian"
      cards={[
        {
          icon: <SearchCheck size={36} />,
          title: "Pengajuan Izin Penelitian",
          description: "Prosedur pengajuan dan persyaratan izin penelitian.",
        },
      ]}
    />
  );
}
