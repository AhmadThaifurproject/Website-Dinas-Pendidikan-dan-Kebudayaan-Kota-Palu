import LayananViewer from "../../../Components/LayananViewer";
import { FileText, ListChecks, Building2 } from "lucide-react";

export default function LayananTugasFungsi() {
  return (
    <LayananViewer
      judul="Tugas dan Fungsi"
      deskripsi="Informasi mengenai tugas dan fungsi Sub Sekretariat dalam mendukung operasional Dinas Pendidikan."
      endpoint="http://localhost:8000/api/sub sekretariat/upload/tugas-fungsi"
      cards={[
        {
          icon: <FileText size={36} />,
          title: "Tugas Pokok",
          description: "Penjabaran tugas utama dari Sub Sekretariat.",
        },
        {
          icon: <ListChecks size={36} />,
          title: "Fungsi Pendukung",
          description: "Fungsi-fungsi administratif dan teknis untuk mendukung kinerja dinas.",
        },
        {
          icon: <Building2 size={36} />,
          title: "Struktur Organisasi",
          description: "Struktur kelembagaan Sub Sekretariat.",
        },
      ]}
    />
  );
}
