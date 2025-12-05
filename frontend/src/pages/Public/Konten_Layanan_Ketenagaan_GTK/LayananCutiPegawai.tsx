import LayananViewer from "../../../Components/LayananViewer";
import { CalendarRange, ClipboardList, CheckCircle } from "lucide-react";

export default function LayananCutiPegawai() {
  return (
    <LayananViewer
      judul="Cuti Pegawai"
      deskripsi="Pengajuan dan verifikasi cuti tahunan, cuti besar, maupun cuti lainnya."
      endpoint="http://localhost:8000/api/kepegawaian/cuti"
      cards={[
        {
          icon: <CalendarRange size={36} />,
          title: "Pengajuan Cuti",
          description: "Formulir dan prosedur pengajuan cuti pegawai.",
        },
        {
          icon: <ClipboardList size={36} />,
          title: "Jenis Cuti",
          description: "Penjelasan jenis cuti seperti tahunan, besar, dan lainnya.",
        },
        {
          icon: <CheckCircle size={36} />,
          title: "Verifikasi & Persetujuan",
          description: "Tahapan persetujuan cuti oleh atasan langsung.",
        },
      ]}
    />
  );
}
