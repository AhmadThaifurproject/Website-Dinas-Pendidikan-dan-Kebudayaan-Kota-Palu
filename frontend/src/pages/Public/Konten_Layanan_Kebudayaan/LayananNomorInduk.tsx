import LayananViewer from "../../../Components/LayananViewer";
import { FileText, ClipboardList, Calendar } from "lucide-react";

export default function LayananNomorInduk() {
  return (
    <LayananViewer
      judul="Nomor Induk Cagar Budaya"
      deskripsi="Penerbitan dan pengelolaan Nomor Induk untuk kategori cagar budaya."
      endpoint="http://localhost:8000/api/kebudayaan/upload/nomor-induk"
      cards={[
        {
          icon: <FileText size={36} />,
          title: "Permohonan NICB",
          description: "Alur pendaftaran dan permohonan NICB.",
        },
        {
          icon: <ClipboardList size={36} />,
          title: "Verifikasi Data",
          description: "Proses pengecekan data sebelum penerbitan.",
        },
        {
          icon: <Calendar size={36} />,
          title: "Penerbitan Nomor",
          description: "Prosedur penerbitan dan pengiriman nomor induk.",
        },
      ]}
    />
  );
}
