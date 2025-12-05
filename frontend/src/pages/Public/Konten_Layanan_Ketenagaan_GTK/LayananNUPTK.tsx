import LayananViewer from "../../../Components/LayananViewer";
import { Hash, FilePlus, ClipboardSignature } from "lucide-react";

export default function LayananNUPTK() {
  return (
    <LayananViewer
      judul="Pelayanan Pengajuan NUPTK"
      deskripsi="Pengajuan Nomor Unik Pendidik dan Tenaga Kependidikan (NUPTK)."
      endpoint="http://localhost:8000/api/kepegawaian/nuptk"
      cards={[
        {
          icon: <Hash size={36} />,
          title: "Pengajuan NUPTK",
          description: "Langkah awal dan syarat pengajuan NUPTK.",
        },
        {
          icon: <FilePlus size={36} />,
          title: "Unggah Dokumen",
          description: "Upload dokumen pendukung untuk verifikasi data.",
        },
        {
          icon: <ClipboardSignature size={36} />,
          title: "Verifikasi & Penerbitan",
          description: "Tahapan validasi hingga penerbitan NUPTK.",
        },
      ]}
    />
  );
}
