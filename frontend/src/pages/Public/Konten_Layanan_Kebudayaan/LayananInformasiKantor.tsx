import LayananViewer from "../../../Components/LayananViewer";
import { FileText, ClipboardList, Calendar } from "lucide-react";

export default function LayananInformasiKantor() {
  return (
    <LayananViewer
      judul="Informasi Langsung di Kantor"
      deskripsi="Layanan informasi dan data cagar budaya secara tatap muka di kantor kebudayaan."
      endpoint="http://localhost:8000/api/kebudayaan/upload/informasi-kantor"
      cards={[
        {
          icon: <ClipboardList size={36} />,
          title: "Layanan Konsultasi",
          description: "Pendampingan dan konsultasi informasi di kantor.",
        },
        {
          icon: <FileText size={36} />,
          title: "Dokumen Informasi",
          description: "Dokumen dan data yang tersedia di kantor.",
        },
        {
          icon: <Calendar size={36} />,
          title: "Jam Layanan",
          description: "Jadwal operasional dan kunjungan ke kantor.",
        },
      ]}
    />
  );
}
