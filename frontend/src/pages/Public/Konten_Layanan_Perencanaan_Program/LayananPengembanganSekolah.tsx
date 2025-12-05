import LayananViewer from "../../../Components/LayananViewer";
import { Building, Wrench, Layers } from "lucide-react";

export default function LayananPengembanganSekolah() {
  return (
    <LayananViewer
      judul="Pengembangan Sekolah"
      deskripsi="Informasi tentang rencana pengembangan infrastruktur sekolah."
      endpoint="http://localhost:8000/api/perencanaan/upload/improve-skolah"
      cards={[
        {
          icon: <Building size={36} />,
          title: "Proyek Infrastruktur",
          description: "Pembangunan dan renovasi sekolah.",
        },
        {
          icon: <Wrench size={36} />,
          title: "Fasilitas Sekolah",
          description: "Pengembangan fasilitas dan sarana belajar.",
        },
        {
          icon: <Layers size={36} />,
          title: "Peta Pengembangan",
          description: "Area dan sekolah yang menjadi prioritas.",
        },
      ]}
    />
  );
}
