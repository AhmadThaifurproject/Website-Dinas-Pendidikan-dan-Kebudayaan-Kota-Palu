import LayananViewer from "../../../Components/LayananViewer";
import { Award } from "lucide-react";

export default function LayananSatyaLencanaKaryaSatya() {
  return (
    <LayananViewer
      judul="Satya Lencana Karya Satya"
      deskripsi="Pengajuan penghargaan Satya Lencana untuk ASN berprestasi."
      endpoint="http://localhost:8000/api/kepegawaian/upload/satyalencana"
      cards={[
        {
          icon: <Award size={36} />,
          title: "Pengajuan Penghargaan",
          description: "Syarat dan proses pengajuan penghargaan Satya Lencana.",
        },
      ]}
    />
  );
}
