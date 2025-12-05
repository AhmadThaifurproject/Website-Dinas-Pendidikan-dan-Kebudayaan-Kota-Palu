import LayananViewer from "../../../Components/LayananViewer";
import { School, ClipboardSignature, CheckSquare } from "lucide-react";

export default function LayananNomorSatuanPendidikan() {
  return (
    <LayananViewer
      judul="Penerbitan Nomor Satuan Pendidikan"
      deskripsi="Pengajuan penerbitan nomor pokok untuk satuan pendidikan."
      endpoint="http://localhost:8000/api/perencanaan/upload/nosapen"
      cards={[
        {
          icon: <School size={36} />,
          title: "Formulir Satuan",
          description: "Pengisian data satuan pendidikan baru.",
        },
        {
          icon: <ClipboardSignature size={36} />,
          title: "Verifikasi",
          description: "Proses verifikasi data satuan pendidikan.",
        },
        {
          icon: <CheckSquare size={36} />,
          title: "Status Pengajuan",
          description: "Pantau proses penerbitan nomor pokok.",
        },
      ]}
    />
  );
}
