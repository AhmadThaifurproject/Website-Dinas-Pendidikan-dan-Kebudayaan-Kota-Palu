import LayananViewer from "../../../Components/LayananViewer";
import { CalendarCheck, FileCheck, UserCheck } from "lucide-react";

export default function LayananPensiun() {
  return (
    <LayananViewer
      judul="Layanan Pensiun"
      deskripsi="Prosedur dan pengajuan pensiun bagi ASN di lingkungan Dinas Pendidikan."
      endpoint="http://localhost:8000/api/kepegawaian/pensiun"
      cards={[
        {
          icon: <CalendarCheck size={36} />,
          title: "Perhitungan Masa Kerja",
          description: "Perhitungan masa kerja untuk penentuan hak pensiun.",
        },
        {
          icon: <FileCheck size={36} />,
          title: "Dokumen Persyaratan",
          description: "Berkas wajib untuk pengajuan pensiun ASN.",
        },
        {
          icon: <UserCheck size={36} />,
          title: "Proses Persetujuan",
          description: "Tahapan validasi dan penerbitan SK pensiun.",
        },
      ]}
    />
  );
}
