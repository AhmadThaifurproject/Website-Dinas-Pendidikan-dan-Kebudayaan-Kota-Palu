import LayananViewer from "../../../Components/LayananViewer";
import { ClipboardList, CalendarCheck, CheckCircle2 } from "lucide-react";

export default function LayananProgramKerja() {
  return (
    <LayananViewer
      judul="Program Kerja"
      deskripsi="Informasi tentang program kerja dan kegiatan yang dilaksanakan oleh Sub Sekretariat."
      endpoint="http://localhost:8000/api/sub sekretariat/upload/program-kerja"
      cards={[
        {
          icon: <ClipboardList size={36} />,
          title: "Rencana Kegiatan",
          description: "Dokumen rencana kerja tahunan Sub Sekretariat.",
        },
        {
          icon: <CalendarCheck size={36} />,
          title: "Jadwal Pelaksanaan",
          description: "Waktu pelaksanaan berbagai kegiatan program kerja.",
        },
        {
          icon: <CheckCircle2 size={36} />,
          title: "Evaluasi Program",
          description: "Penilaian hasil dan capaian dari pelaksanaan program kerja.",
        },
      ]}
    />
  );
}
