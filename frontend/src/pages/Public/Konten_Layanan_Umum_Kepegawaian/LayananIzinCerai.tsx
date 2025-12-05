import LayananViewer from "../../../Components/LayananViewer";
import { HeartCrack } from "lucide-react";

export default function LayananIzinCerai() {
  return (
    <LayananViewer
      judul="Izin Cerai"
      deskripsi="Pengajuan izin cerai bagi ASN sesuai ketentuan perundang-undangan."
      endpoint="http://localhost:8000/api/kepegawaian/upload/izincerai"
      cards={[
        {
          icon: <HeartCrack size={36} />,
          title: "Pengajuan Izin Cerai",
          description: "Langkah dan persyaratan pengajuan izin cerai ASN.",
        },
      ]}
    />
  );
}
