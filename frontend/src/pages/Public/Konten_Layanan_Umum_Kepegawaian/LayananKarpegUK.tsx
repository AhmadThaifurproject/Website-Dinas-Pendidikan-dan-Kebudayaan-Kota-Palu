import LayananViewer from "../../../Components/LayananViewer";
import { BadgeCheck } from "lucide-react";

export default function LayananKarpeg() {
  return (
    <LayananViewer
      judul="Kartu Pegawai (KARPEG)"
      deskripsi="Permohonan dan pencetakan ulang KARPEG ASN."
      endpoint="http://localhost:8000/api/kepegawaian/upload/kartu-pegawai"
      cards={[
        {
          icon: <BadgeCheck size={36} />,
          title: "Permohonan KARPEG",
          description: "Proses pengajuan dan pencetakan ulang kartu pegawai.",
        },
      ]}
    />
  );
}
