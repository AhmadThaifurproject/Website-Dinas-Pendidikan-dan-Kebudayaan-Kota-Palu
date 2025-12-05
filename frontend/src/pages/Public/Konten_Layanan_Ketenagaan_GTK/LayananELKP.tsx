import LayananViewer from "../../../Components/LayananViewer";
import { FileBarChart2, UploadCloud, Clock4 } from "lucide-react";

export default function LayananELKP() {
  return (
    <LayananViewer
      judul="E-Laporan Kinerja (e-LKP)"
      deskripsi="Pelaporan kinerja secara elektronik untuk ASN Dinas Pendidikan."
      endpoint="http://localhost:8000/api/kepegawaian/e-lkp"
      cards={[
        {
          icon: <FileBarChart2 size={36} />,
          title: "Pengisian e-LKP",
          description: "Panduan dan form pengisian laporan kinerja.",
        },
        {
          icon: <UploadCloud size={36} />,
          title: "Upload Data Kinerja",
          description: "Unggah laporan secara berkala dan terstruktur.",
        },
        {
          icon: <Clock4 size={36} />,
          title: "Monitoring & Evaluasi",
          description: "Penilaian dan review kinerja berdasarkan e-LKP.",
        },
      ]}
    />
  );
}
