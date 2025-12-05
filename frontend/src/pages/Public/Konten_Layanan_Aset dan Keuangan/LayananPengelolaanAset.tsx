import LayananViewer from "../../../Components/LayananViewer";
import { Boxes, FileText, ClipboardList } from "lucide-react";

export default function LayananPengelolaanAset() {
  return (
    <LayananViewer
      judul="Pengelolaan Aset"
      deskripsi="Informasi mengenai pengelolaan dan inventarisasi aset Dinas Pendidikan."
      endpoint="http://localhost:8000/api/aset & keuangan/upload/kelola-aset"
      cards={[
        {
          icon: <Boxes size={36} />,
          title: "Inventaris Aset",
          description: "Data aset yang tercatat di Dinas Pendidikan.",
        },
        {
          icon: <FileText size={36} />,
          title: "Laporan Aset",
          description: "Dokumentasi laporan tahunan pengelolaan aset.",
        },
        {
          icon: <ClipboardList size={36} />,
          title: "Pemeliharaan",
          description: "Prosedur perawatan dan perbaikan aset.",
        },
      ]}
    />
  );
}
