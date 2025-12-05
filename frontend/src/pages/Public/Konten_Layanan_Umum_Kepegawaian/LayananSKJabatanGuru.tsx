import LayananViewer from "../../../Components/LayananViewer";
import { Briefcase } from "lucide-react";

export default function LayananSKJabatanGuru() {
  return (
    <LayananViewer
      judul="SK Jabatan Guru"
      deskripsi="Permohonan SK jabatan untuk guru dan tenaga pendidik."
      endpoint="http://localhost:8000/api/kepegawaian/upload/skjabfungguru"
      cards={[
        {
          icon: <Briefcase size={36} />,
          title: "Permohonan SK Jabatan",
          description: "Proses permohonan SK jabatan bagi guru dan tenaga pendidik.",
        },
      ]}
    />
  );
}
