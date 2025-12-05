import LayananViewer from "../../../Components/LayananViewer";
import { ClipboardList, FileText, Calendar } from "lucide-react";

export default function LayananPenemuanObjek() {
  return (
    <LayananViewer
      judul="Penemuan Objek Diduga Cagar Budaya"
      deskripsi="Pelaporan dan penanganan penemuan benda atau situs yang diduga cagar budaya."
      endpoint="http://localhost:8000/api/Kebudayaan/upload/penemuan-objek"
      cards={[
        {
          icon: <ClipboardList size={36} />,
          title: "Pelaporan Awal",
          description: "Langkah awal melaporkan objek diduga cagar budaya.",
        },
        {
          icon: <FileText size={36} />,
          title: "Dokumentasi Objek",
          description: "Cara mendokumentasikan objek temuan.",
        },
        {
          icon: <Calendar size={36} />,
          title: "Tindak Lanjut",
          description: "Tahapan proses setelah pelaporan.",
        },
      ]}
    />
  );
}
