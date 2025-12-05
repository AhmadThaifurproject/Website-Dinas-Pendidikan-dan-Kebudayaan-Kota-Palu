import LayananViewer from "../../../Components/LayananViewer";
import { Wallet, ClipboardList, BarChart3 } from "lucide-react";

export default function LayananPengelolaanKeuangan() {
  return (
    <LayananViewer
      judul="Pengelolaan Keuangan"
      deskripsi="Informasi tentang pengelolaan anggaran dan keuangan Dinas Pendidikan."
      endpoint="http://localhost:8000/api/aset & keuangan/upload/kelola-uang"
      cards={[
        {
          icon: <Wallet size={36} />,
          title: "Anggaran",
          description: "Informasi anggaran tahunan dan penggunaannya.",
        },
        {
          icon: <ClipboardList size={36} />,
          title: "Laporan Keuangan",
          description: "Dokumentasi laporan realisasi anggaran.",
        },
        {
          icon: <BarChart3 size={36} />,
          title: "Analisis Keuangan",
          description: "Analisis dan evaluasi pengelolaan keuangan.",
        },
      ]}
    />
  );
}
