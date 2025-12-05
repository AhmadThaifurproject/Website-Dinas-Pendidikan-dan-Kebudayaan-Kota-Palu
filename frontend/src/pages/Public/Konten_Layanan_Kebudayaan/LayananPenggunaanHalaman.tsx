import LayananViewer from "../../../Components/LayananViewer";
import { ClipboardList, FileText, Calendar } from "lucide-react";

export default function LayananPenggunaanHalaman() {
  return (
    <LayananViewer
      judul="Penggunaan Halaman Cagar Budaya"
      deskripsi="Aturan dan tata cara penggunaan halaman dan fasilitas cagar budaya."
      endpoint="http://localhost:8000/api/kebudayaan/upload/penggunaan-halaman"
      cards={[
        {
          icon: <ClipboardList size={36} />,
          title: "Tata Tertib",
          description: "Aturan penggunaan ruang publik di cagar budaya.",
        },
        {
          icon: <FileText size={36} />,
          title: "Surat Izin",
          description: "Syarat dan prosedur pembuatan surat izin penggunaan.",
        },
        {
          icon: <Calendar size={36} />,
          title: "Ketersediaan Jadwal",
          description: "Informasi tentang jadwal dan pemesanan tempat.",
        },
      ]}
    />
  );
}
