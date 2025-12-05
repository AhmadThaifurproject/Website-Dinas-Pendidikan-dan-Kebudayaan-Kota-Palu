import LayananViewer from "../../../Components/LayananViewer";
import { ClipboardList, FileText, Calendar } from "lucide-react";

export default function LayananPendataan() {
  return (
    <LayananViewer
      judul="Pendataan Cagar Budaya"
      deskripsi="Proses pendataan dan inventarisasi situs dan benda cagar budaya."
      endpoint="http://localhost:8000/api/kebudayaan/upload/pendataan"
      cards={[
        {
          icon: <ClipboardList size={36} />,
          title: "Metode Pendataan",
          description: "Teknik dan standar pendataan objek cagar budaya.",
        },
        {
          icon: <FileText size={36} />,
          title: "Formulir Pendataan",
          description: "Format data dan dokumen pendukung pendataan.",
        },
        {
          icon: <Calendar size={36} />,
          title: "Jadwal Inventarisasi",
          description: "Waktu pelaksanaan pendataan dan verifikasi.",
        },
      ]}
    />
  );
}
