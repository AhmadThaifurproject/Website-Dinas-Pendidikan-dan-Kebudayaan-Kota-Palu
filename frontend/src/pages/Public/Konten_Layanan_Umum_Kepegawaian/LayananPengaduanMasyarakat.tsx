import LayananViewer from "../../../Components/LayananViewer";
import { Megaphone } from "lucide-react";

export default function LayananPengaduanMasyarakat() {
  return (
    <LayananViewer
      judul="Pengaduan Masyarakat"
      deskripsi="Penyampaian pengaduan, saran, atau keluhan masyarakat terkait layanan kepegawaian."
      endpoint="http://localhost:8000/api/kepegawaian/upload/pengaduan"
      cards={[
        {
          icon: <Megaphone size={36} />,
          title: "Pengaduan dan Saran",
          description: "Mekanisme penyampaian pengaduan dan saran masyarakat.",
        },
      ]}
    />
  );
}
