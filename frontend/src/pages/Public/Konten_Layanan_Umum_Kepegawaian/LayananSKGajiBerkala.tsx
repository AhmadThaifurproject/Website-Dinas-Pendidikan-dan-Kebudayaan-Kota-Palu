import LayananViewer from "../../../Components/LayananViewer";
import { Coins } from "lucide-react";

export default function LayananSKGajiBerkala() {
  return (
    <LayananViewer
      judul="SK Gaji Berkala"
      deskripsi="Proses penerbitan dan pembaruan SK kenaikan gaji berkala ASN."
      endpoint="http://localhost:8000/api/kepegawaian/upload/skgajiberkala"
      cards={[
        {
          icon: <Coins size={36} />,
          title: "Penerbitan SK Gaji",
          description: "Pengajuan dan pembaruan SK kenaikan gaji berkala.",
        },
      ]}
    />
  );
}
