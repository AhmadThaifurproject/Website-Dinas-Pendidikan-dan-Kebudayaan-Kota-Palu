import LayananViewer from "../../../Components/LayananViewer";
import { Users, BarChart2, Lightbulb } from "lucide-react";

export default function LayananBimbinganKarier() {
  return (
    <LayananViewer
      judul="Bimbingan Karier"
      deskripsi="Layanan konsultasi karier dan pengembangan profesional pegawai."
      endpoint="http://localhost:8000/api/kepegawaian/bimbingan-karier"
      cards={[
        {
          icon: <Users size={36} />,
          title: "Konsultasi Karier",
          description: "Sesi konsultasi individu untuk pengembangan karier.",
        },
        {
          icon: <BarChart2 size={36} />,
          title: "Perencanaan Karier",
          description: "Pemetaan dan strategi peningkatan jenjang karier.",
        },
        {
          icon: <Lightbulb size={36} />,
          title: "Pelatihan & Pengembangan",
          description: "Informasi pelatihan dan pengembangan kompetensi.",
        },
      ]}
    />
  );
}
