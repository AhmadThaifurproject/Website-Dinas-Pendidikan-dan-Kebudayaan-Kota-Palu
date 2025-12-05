import LayananViewer from "../../../Components/LayananViewer";
import { Repeat, ClipboardCheck, MapPin } from "lucide-react";

export default function LayananMutasiRotasi() {
  return (
    <LayananViewer
      judul="Mutasi & Rotasi Pegawai"
      deskripsi="Proses pengajuan mutasi atau rotasi bagi tenaga pendidik dan kependidikan."
      endpoint="http://localhost:8000/api/kepegawaian/mutasi-rotasi"
      cards={[
        {
          icon: <Repeat size={36} />,
          title: "Pengajuan Mutasi",
          description: "Langkah awal untuk mengajukan mutasi atau rotasi.",
        },
        {
          icon: <ClipboardCheck size={36} />,
          title: "Persyaratan & Formulir",
          description: "Daftar dokumen dan formulir yang harus dilengkapi.",
        },
        {
          icon: <MapPin size={36} />,
          title: "Penempatan Baru",
          description: "Informasi lokasi dan posisi hasil mutasi atau rotasi.",
        },
      ]}
    />
  );
}
