import LayananViewer from "../../../Components/LayananViewer";
import { FileSearch, Stamp, FileCheck2 } from "lucide-react";

export default function LayananSKCPNSPNS() {
  return (
    <LayananViewer
      judul="SK CPNS & PNS"
      deskripsi="Permintaan salinan SK CPNS atau PNS serta pengesahan dokumen kepegawaian."
      endpoint="http://localhost:8000/api/kepegawaian/sk-cpns-pns"
      cards={[
        {
          icon: <FileSearch size={36} />,
          title: "Permintaan Salinan SK",
          description: "Layanan cetak ulang SK CPNS dan PNS.",
        },
        {
          icon: <Stamp size={36} />,
          title: "Pengesahan Dokumen",
          description: "Legalisasi dan validasi dokumen SK kepegawaian.",
        },
        {
          icon: <FileCheck2 size={36} />,
          title: "Verifikasi Administratif",
          description: "Pemeriksaan keabsahan dan data ASN.",
        },
      ]}
    />
  );
}
