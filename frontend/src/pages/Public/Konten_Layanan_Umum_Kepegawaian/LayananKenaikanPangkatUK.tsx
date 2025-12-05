import LayananViewer from "../../../Components/LayananViewer";
import { TrendingUp } from "lucide-react";

export default function LayananKenaikanPangkat() {
  return (
    <LayananViewer
      judul="Kenaikan Pangkat Reguler"
      deskripsi="Pengajuan kenaikan pangkat reguler untuk guru dan tenaga kependidikan."
      endpoint="http://localhost:8000/api/kepegawaian/upload/kenaikan-pangkat"
      cards={[
        {
          icon: <TrendingUp size={36} />,
          title: "Pengajuan Kenaikan Pangkat",
          description: "Prosedur dan dokumen yang dibutuhkan untuk pengajuan kenaikan pangkat.",
        },
      ]}
    />
  );
}
