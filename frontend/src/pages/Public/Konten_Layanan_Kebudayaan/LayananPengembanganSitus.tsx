import LayananViewer from "../../../Components/LayananViewer";
import { FileText, ClipboardList, Calendar } from "lucide-react";

export default function LayananPengembanganSitus() {
  return (
    <LayananViewer
      judul="Pengembangan Situs Cagar Budaya"
      deskripsi="Upaya pelestarian dan pengembangan situs cagar budaya agar terjaga dan dimanfaatkan."
      endpoint="http://localhost:8000/api/kebudayaan/upload/pengembangan-situs"
      cards={[
        {
          icon: <FileText size={36} />,
          title: "Program Pelestarian",
          description: "Kegiatan pelestarian dan pemeliharaan situs.",
        },
        {
          icon: <ClipboardList size={36} />,
          title: "Revitalisasi",
          description: "Rencana pengembangan fisik dan fungsi situs.",
        },
        {
          icon: <Calendar size={36} />,
          title: "Monitoring Berkala",
          description: "Penjadwalan monitoring dan evaluasi situs.",
        },
      ]}
    />
  );
}
