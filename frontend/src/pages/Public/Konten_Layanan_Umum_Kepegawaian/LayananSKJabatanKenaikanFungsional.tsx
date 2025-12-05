import LayananViewer from "../../../Components/LayananViewer";
import { UploadCloud } from "lucide-react";

export default function LayananSKJabatanKenaikanFungsional() {
  return (
    <LayananViewer
      judul="SK Jabatan Kenaikan Fungsional"
      deskripsi="Pengajuan SK jabatan terkait kenaikan jabatan fungsional."
      endpoint="http://localhost:8000/api/kepegawaian/upload/skjabfung"
      cards={[
        {
          icon: <UploadCloud size={36} />,
          title: "Pengajuan SK Jabatan",
          description: "Proses dan persyaratan kenaikan jabatan fungsional.",
        },
      ]}
    />
  );
}
