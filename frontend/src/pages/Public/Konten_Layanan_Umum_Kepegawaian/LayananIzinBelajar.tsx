import LayananViewer from "../../../Components/LayananViewer";
import { BookOpenCheck } from "lucide-react";

export default function LayananIzinBelajar() {
  return (
    <LayananViewer
      judul="Izin Belajar"
      deskripsi="Pengajuan izin belajar bagi pegawai ASN di lingkungan Dinas Pendidikan."
      endpoint="http://localhost:8000/api/kepegawaian/upload/izinbelajar"
      cards={[
        {
          icon: <BookOpenCheck size={36} />,
          title: "Pengajuan Izin Belajar",
          description: "Persyaratan dan prosedur pengajuan izin belajar.",
        },
      ]}
    />
  );
}
