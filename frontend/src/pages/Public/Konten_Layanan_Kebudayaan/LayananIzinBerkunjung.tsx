import LayananViewer from "../../../Components/LayananViewer";
import { Calendar, ClipboardList, FileText } from "lucide-react";

export default function LayananIzinBerkunjung() {
  return (
    <LayananViewer
      judul="Izin Berkunjung ke Cagar Budaya"
      deskripsi="Panduan dan prosedur pengajuan izin untuk berkunjung ke situs cagar budaya."
      endpoint="http://localhost:8000/api/kebudayaan/upload/izin-berkunjung"
      cards={[
        {
          icon: <ClipboardList size={36} />,
          title: "Syarat Permohonan",
          description: "Dokumen dan ketentuan untuk mengajukan izin berkunjung.",
        },
        {
          icon: <Calendar size={36} />,
          title: "Jadwal Kunjungan",
          description: "Pilihan tanggal dan waktu kunjungan ke situs cagar budaya.",
        },
        {
          icon: <FileText size={36} />,
          title: "Formulir Permohonan",
          description: "Unduh dan isi formulir permohonan kunjungan.",
        },
      ]}
    />
  );
}
