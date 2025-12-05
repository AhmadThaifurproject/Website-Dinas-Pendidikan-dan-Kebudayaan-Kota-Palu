import LayananViewer from "../../../Components/LayananViewer";
import { FileText, ClipboardList, DollarSign } from "lucide-react";

export default function LayananPerencanaanAnggaran() {
  return (
    <LayananViewer
      judul="Perencanaan Anggaran"
      deskripsi="Sistem perencanaan dan penganggaran untuk program-program pendidikan."
      endpoint="http://localhost:8000/api/perencanaan/upload/perencanaan-anggaran"
      cards={[
        {
          icon: <FileText size={36} />,
          title: "Rencana Anggaran",
          description: "Dokumen rencana pengeluaran pendidikan.",
        },
        {
          icon: <DollarSign size={36} />,
          title: "Pengalokasian Dana",
          description: "Alokasi dana per program pendidikan.",
        },
        {
          icon: <ClipboardList size={36} />,
          title: "Realisasi Anggaran",
          description: "Data realisasi dari anggaran yang telah direncanakan.",
        },
      ]}
    />
  );
}
