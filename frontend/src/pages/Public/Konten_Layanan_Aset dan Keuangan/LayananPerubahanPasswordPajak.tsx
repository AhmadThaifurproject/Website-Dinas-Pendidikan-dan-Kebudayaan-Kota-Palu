import LayananViewer from "../../../Components/LayananViewer";
import { LockKeyhole, Settings, UserCog } from "lucide-react";

export default function LayananPerubahanPasswordPajak() {
  return (
    <LayananViewer
      judul="Perubahan Password Akun Pajak"
      deskripsi="Layanan untuk melakukan perubahan password akun pajak pegawai."
      endpoint="http://localhost:8000/api/aset & keuangan/upload/ubah-password-pajak"
      cards={[
        {
          icon: <LockKeyhole size={36} />,
          title: "Formulir Perubahan",
          description: "Pengisian data untuk perubahan password.",
        },
        {
          icon: <Settings size={36} />,
          title: "Panduan Reset",
          description: "Langkah-langkah teknis reset password pajak.",
        },
        {
          icon: <UserCog size={36} />,
          title: "Bantuan Teknis",
          description: "Kontak teknis untuk bantuan perubahan akun.",
        },
      ]}
    />
  );
}
