import LayananViewer from "../../../Components/LayananViewer";
import { Badge, RefreshCw, FileText } from "lucide-react";

export default function LayananKarpeg() {
  return (
    <LayananViewer
      judul="Kartu Pegawai (KARPEG)"
      deskripsi="Permohonan dan pencetakan ulang KARPEG ASN."
      endpoint="http://localhost:8000/api/ketenagaan gtk/upload/kartu-pegawai"
      cards={[
        {
          icon: <Badge size={36} />,
          title: "Permohonan Baru",
          description: "Pengajuan pembuatan KARPEG untuk ASN baru.",
        },
        {
          icon: <RefreshCw size={36} />,
          title: "Pencetakan Ulang",
          description: "Permintaan pencetakan ulang KARPEG yang hilang atau rusak.",
        },
        {
          icon: <FileText size={36} />,
          title: "Dokumen Pendukung",
          description: "Persyaratan berkas yang harus dilengkapi.",
        },
      ]}
    />
  );
}
