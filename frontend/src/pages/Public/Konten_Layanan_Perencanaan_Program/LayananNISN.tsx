import LayananViewer from "../../../Components/LayananViewer";
import { UserCircle, UserPlus, Search } from "lucide-react";

export default function LayananNISN() {
  return (
    <LayananViewer
      judul="Pengajuan NISN"
      deskripsi="Proses pengajuan Nomor Induk Siswa Nasional (NISN) bagi pelajar."
      endpoint="http://localhost:8000/api/perencanaan/upload/nisn"
      cards={[
        {
          icon: <UserCircle size={36} />,
          title: "Formulir NISN",
          description: "Formulir pengajuan nomor induk siswa.",
        },
        {
          icon: <UserPlus size={36} />,
          title: "Registrasi Siswa",
          description: "Pendaftaran siswa baru untuk mendapatkan NISN.",
        },
        {
          icon: <Search size={36} />,
          title: "Pencarian NISN",
          description: "Lacak status pengajuan atau temukan NISN siswa.",
        },
      ]}
    />
  );
}
