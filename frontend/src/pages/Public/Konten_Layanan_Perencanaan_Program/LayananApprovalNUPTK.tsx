import LayananViewer from "../../../Components/LayananViewer";
import { UserCheck, ClipboardCheck, ThumbsUp } from "lucide-react";

export default function LayananApprovalNUPTK() {
  return (
    <LayananViewer
      judul="Approval NUPTK"
      deskripsi="Proses persetujuan pengajuan nomor unik untuk pendidik dan tenaga kependidikan."
      endpoint="http://localhost:8000/api/perencanaan/upload/approval-nuptk"
      cards={[
        {
          icon: <UserCheck size={36} />,
          title: "Data GTK",
          description: "Data calon penerima NUPTK.",
        },
        {
          icon: <ClipboardCheck size={36} />,
          title: "Status Pengajuan",
          description: "Lacak status permohonan NUPTK.",
        },
        {
          icon: <ThumbsUp size={36} />,
          title: "Persetujuan",
          description: "Konfirmasi dan persetujuan dari dinas.",
        },
      ]}
    />
  );
}
