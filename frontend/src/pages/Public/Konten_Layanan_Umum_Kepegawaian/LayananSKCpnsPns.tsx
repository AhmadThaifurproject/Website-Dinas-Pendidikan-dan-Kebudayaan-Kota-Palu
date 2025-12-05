import LayananViewer from "../../../Components/LayananViewer";
import { FileText } from "lucide-react";

export default function LayananSKCpnsPns() {
  return (
    <LayananViewer
      judul="SK CPNS & PNS"
      deskripsi="Permintaan salinan SK CPNS atau PNS serta legalisasi dokumen kepegawaian."
      endpoint="http://localhost:8000/api/kepegawaian/upload/skcpnspns"
      cards={[
        {
          icon: <FileText size={36} />,
          title: "Permintaan SK",
          description: "Cara mengajukan permintaan dan legalisasi SK CPNS & PNS.",
        },
      ]}
    />
  );
}
