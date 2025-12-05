import LayananViewer from "../../../Components/LayananViewer";
import { FileText, ClipboardList, Calendar } from "lucide-react";

export default function LayananSosialMedia() {
  return (
    <LayananViewer
      judul="Informasi Cagar Budaya via Media Sosial"
      deskripsi="Penyebaran informasi dan data terkait cagar budaya melalui platform media sosial."
      endpoint="http://localhost:8000/api/kebudayaan/upload/informasi-sosial"
      cards={[
        {
          icon: <FileText size={36} />,
          title: "Konten Edukasi",
          description: "Materi edukatif tentang cagar budaya di media sosial.",
        },
        {
          icon: <ClipboardList size={36} />,
          title: "Jadwal Unggahan",
          description: "Waktu dan tema konten yang dibagikan.",
        },
        {
          icon: <Calendar size={36} />,
          title: "Interaksi Masyarakat",
          description: "Kegiatan publik dan kolaborasi melalui media sosial.",
        },
      ]}
    />
  );
}
