import LayananViewer from "../../../Components/LayananViewer";
import { FileText, UserCheck, Banknote } from "lucide-react";

export default function LayananPengajuanGaji() {
  return (
    <LayananViewer
      judul="Pelayanan Pengajuan Gaji"
      deskripsi="Pelayanan pengajuan gaji untuk Dinas Pendidikan, Korwil, PAUD, SD, IMB, dan SKB."
      endpoint="http://localhost:8000/api/aset & keuangan/upload/ajuan-gaji"
      cards={[
        {
          icon: <UserCheck size={36} />,
          title: "Data Pegawai",
          description: "Informasi pegawai yang mengajukan gaji.",
        },
        {
          icon: <Banknote size={36} />,
          title: "Detail Gaji",
          description: "Rincian nominal dan komponen gaji.",
        },
        {
          icon: <FileText size={36} />,
          title: "Status Pengajuan",
          description: "Tahapan proses pengajuan gaji.",
        },
      ]}
    />
  );
}
