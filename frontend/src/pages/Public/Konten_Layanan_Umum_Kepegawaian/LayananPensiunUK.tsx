import LayananViewer from "../../../Components/LayananViewer";
import { CalendarCheck } from "lucide-react";

export default function LayananPensiun() {
  return (
    <LayananViewer
      judul="Pelayanan Pensiun"
      deskripsi="Prosedur dan pengajuan pensiun termasuk BUP dan pensiun janda/duda."
      endpoint="http://localhost:8000/api/kepegawaian/upload/pensiun"
      cards={[
        {
          icon: <CalendarCheck size={36} />,
          title: "Pengajuan Pensiun",
          description: "Langkah-langkah dan berkas untuk pengajuan pensiun ASN.",
        },
      ]}
    />
  );
}
