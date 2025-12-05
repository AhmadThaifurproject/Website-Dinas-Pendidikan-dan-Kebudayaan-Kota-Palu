import LayananViewer from "../../../Components/LayananViewer";
import { Database, Users, FileSearch } from "lucide-react";

export default function LayananDAPODIK() {
  return (
    <LayananViewer
      judul="Pelayanan DAPODIK"
      deskripsi="Informasi dan layanan terkait Data Pokok Pendidikan (DAPODIK)."
      endpoint="http://localhost:8000/api/perencanaan/upload/dapodikp"
      cards={[
        {
          icon: <Database size={36} />,
          title: "Database Pendidikan",
          description: "Data pokok seluruh sekolah dan siswa.",
        },
        {
          icon: <Users size={36} />,
          title: "Verifikasi Data",
          description: "Validasi data siswa dan sekolah.",
        },
        {
          icon: <FileSearch size={36} />,
          title: "Laporan DAPODIK",
          description: "Rekap laporan per semester.",
        },
      ]}
    />
  );
}
