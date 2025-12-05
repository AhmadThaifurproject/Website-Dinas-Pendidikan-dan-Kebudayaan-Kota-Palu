import LayananViewer from "../../../Components/LayananViewer";
import { Plane } from "lucide-react";

export default function LayananCutiUmrohHajiMelahirkan() {
  return (
    <LayananViewer
      judul="Cuti, Umroh/Haji, Melahirkan"
      deskripsi="Pengajuan berbagai jenis cuti pegawai, termasuk umroh/haji dan cuti melahirkan."
      endpoint="http://localhost:8000/api/kepegawaian/upload/cutipegawai"
      cards={[
        {
          icon: <Plane size={36} />,
          title: "Pengajuan Cuti",
          description: "Jenis-jenis cuti dan proses pengajuannya.",
        },
      ]}
    />
  );
}
