import LayananViewer from "../../../Components/LayananViewer";
import { UploadCloud, FileText, BadgeCheck } from "lucide-react";

export default function LayananKenaikanPangkat() {
  return (
    <LayananViewer
      judul="Layanan Kenaikan Pangkat"
      deskripsi="Pengajuan kenaikan pangkat guru dan staf tata usaha berdasarkan ketentuan yang berlaku."
      endpoint="http://localhost:8000/api/ketenagaan gtk/upload/kenaikan-pangkat"
      cards={[
        {
          icon: <UploadCloud size={36} />,
          title: "Pengajuan Berkas",
          description: "Unggah dokumen persyaratan untuk kenaikan pangkat.",
        },
        {
          icon: <FileText size={36} />,
          title: "Verifikasi Dokumen",
          description: "Pemeriksaan kelengkapan dan keabsahan berkas.",
        },
        {
          icon: <BadgeCheck size={36} />,
          title: "Persetujuan Pangkat Baru",
          description: "Proses persetujuan dan penerbitan SK kenaikan pangkat.",
        },
      ]}
    />
  );
}
