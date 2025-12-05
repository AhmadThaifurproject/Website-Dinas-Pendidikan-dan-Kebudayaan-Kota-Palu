import LayananViewer from "../../../Components/LayananViewer";
import { CheckCheck, FileText, Users } from "lucide-react";

export default function LayananVerifikasiDanaBOP() {
  return (
    <LayananViewer
      judul="Verifikasi Dana BOP"
      deskripsi="Layanan verifikasi dana Bantuan Operasional Pendidikan untuk PAUD, TK, SKB, dan PKBM Non Formal Negeri & Swasta."
      endpoint="http://localhost:8000/api/asetkeuangan/upload/Verif-dana-bop"
      cards={[
        {
          icon: <CheckCheck size={36} />,
          title: "Data Verifikasi",
          description: "Dokumen dan persyaratan verifikasi BOP.",
        },
        {
          icon: <Users size={36} />,
          title: "Lembaga Penerima",
          description: "Daftar lembaga penerima dana BOP.",
        },
        {
          icon: <FileText size={36} />,
          title: "Laporan Penggunaan",
          description: "Laporan penggunaan dana BOP oleh lembaga.",
        },
      ]}
    />
  );
}
