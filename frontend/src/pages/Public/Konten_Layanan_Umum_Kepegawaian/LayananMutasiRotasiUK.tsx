import LayananViewer from "../../../Components/LayananViewer";
import { Shuffle } from "lucide-react";

export default function LayananMutasiRotasi() {
  return (
    <LayananViewer
      judul="Mutasi & Rotasi Pegawai"
      deskripsi="Pengajuan mutasi, rotasi, dan perpindahan guru atau tenaga kependidikan."
      endpoint="http://localhost:8000/api/kepegawaian/upload/mutasirotasi"
      cards={[
        {
          icon: <Shuffle size={36} />,
          title: "Mutasi & Rotasi",
          description: "Syarat dan alur mutasi serta rotasi pegawai.",
        },
      ]}
    />
  );
}
