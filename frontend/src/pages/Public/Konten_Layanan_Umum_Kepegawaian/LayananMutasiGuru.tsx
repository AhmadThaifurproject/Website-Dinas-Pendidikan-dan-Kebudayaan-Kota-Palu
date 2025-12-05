import LayananViewer from "../../../Components/LayananViewer";
import { UserCheck } from "lucide-react";

export default function LayananMutasiGuru() {
  return (
    <LayananViewer
      judul="Mutasi Guru"
      deskripsi="Permohonan mutasi tempat tugas bagi guru."
      endpoint="http://localhost:8000/api/kepegawaian/upload/mutasiguru"
      cards={[
        {
          icon: <UserCheck size={36} />,
          title: "Pengajuan Mutasi",
          description: "Syarat dan alur permohonan mutasi guru.",
        },
      ]}
    />
  );
}
