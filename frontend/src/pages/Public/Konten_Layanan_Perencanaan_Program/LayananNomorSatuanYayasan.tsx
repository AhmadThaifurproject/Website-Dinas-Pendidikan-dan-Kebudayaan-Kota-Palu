import LayananViewer from "../../../Components/LayananViewer";
import { Landmark, FilePlus, BadgeCheck } from "lucide-react";

export default function LayananNomorSatuanYayasan() {
  return (
    <LayananViewer
      judul="Penerbitan Nomor Satuan Yayasan"
      deskripsi="Pengajuan penerbitan nomor pokok untuk satuan yayasan pendidikan."
      endpoint="http://localhost:8000/api/perencanaan/upload/nosaya"
      cards={[
        {
          icon: <Landmark size={36} />,
          title: "Data Yayasan",
          description: "Informasi resmi yayasan pendidikan.",
        },
        {
          icon: <FilePlus size={36} />,
          title: "Pengajuan Nomor",
          description: "Formulir dan dokumen yang dibutuhkan.",
        },
        {
          icon: <BadgeCheck size={36} />,
          title: "Persetujuan",
          description: "Status persetujuan nomor satuan yayasan.",
        },
      ]}
    />
  );
}
