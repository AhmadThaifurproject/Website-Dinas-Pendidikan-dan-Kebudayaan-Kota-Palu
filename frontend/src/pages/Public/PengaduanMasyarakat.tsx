import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const PengaduanMasyarakat = () => {
  const [formData, setFormData] = useState<{
    nama: string;
    kontak: string;
    jenisPemohon: string;
    judul: string;
    isiLaporan: string;
    identitas: File | null;
    dokumenOrganisasi: File | null;
    buktiPendukung: File | null;
  }>({
    nama: "",
    kontak: "",
    jenisPemohon: "Individu",
    judul: "",
    isiLaporan: "",
    identitas: null,
    dokumenOrganisasi: null,
    buktiPendukung: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("nama", formData.nama);
    formPayload.append("kontak", formData.kontak);
    formPayload.append("jenis_pemohon", formData.jenisPemohon); // ✅ snake_case
    formPayload.append("judul", formData.judul);
    formPayload.append("isi_laporan", formData.isiLaporan);     // ✅ snake_case
    if (formData.identitas) formPayload.append("identitas", formData.identitas);
    if (formData.dokumenOrganisasi)
      formPayload.append("dokumenOrganisasi", formData.dokumenOrganisasi); // sesuai backend
    if (formData.buktiPendukung)
      formPayload.append("buktiPendukung", formData.buktiPendukung); // sesuai backend

    try {
      const response = await axios.post("/api/pengaduan", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Laporan berhasil dikirim:", response.data);
      alert("Laporan Anda telah dikirim. Terima kasih.");

      // Kosongkan form
      setFormData({
        nama: "",
        kontak: "",
        jenisPemohon: "Individu",
        judul: "",
        isiLaporan: "",
        identitas: null,
        dokumenOrganisasi: null,
        buktiPendukung: null,
      });
    } catch (error) {
      console.error("Gagal mengirim laporan:", error);
      alert("Gagal mengirim laporan. Coba lagi.");
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Banner */}
      <section className="relative h-[45vh] bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#6dd5ed] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0" />
        <div className="relative z-10 h-full flex items-start px-10 md:px-24 pt-16 md:pt-20">
          <div className="max-w-2xl">
            <div className="w-20 h-1 bg-yellow-300 mb-4"></div>
            <div className="text-sm text-yellow-300 mb-2 tracking-widest uppercase">
              <Link to="/" className="hover:underline text-white font-medium">
                Beranda
              </Link>
              <span className="mx-1">/</span>
              <span className="text-white">Pengaduan Masyarakat</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
              Pengaduan Masyarakat
            </h1>
            <p className="text-lg text-white/90 font-light">
              Halaman ini ditujukan untuk menerima dan menindaklanjuti aspirasi atau keluhan dari masyarakat
              <span className="font-semibold text-white"> terkait layanan Dinas Pendidikan Kota Palu</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Konten */}
      <section className="px-6 md:px-24 py-10 bg-white text-gray-800 space-y-12">
        {/* Jam Operasional */}
        <div className="bg-yellow-100 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-yellow-800">Jam Operasional Layanan Pengaduan</h2>
          <p className="text-gray-700">
            Senin – Jumat: <strong>08.00 – 16.00 WITA</strong><br />
            Istirahat: <strong>12.00 – 13.00 WITA</strong><br />
            Sabtu & Minggu: <span className="italic">Tutup</span>
          </p>
        </div>

        {/* Persyaratan */}
        <div className="bg-blue-100 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Persyaratan Pengajuan Laporan</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Individu:</strong> KTP/SIM/Paspor pemohon</li>
            <li><strong>Kelompok Orang:</strong> KTP/SIM/Paspor seluruh anggota kelompok</li>
            <li>
              <strong>Organisasi Berbadan Hukum:</strong>
              <ul className="list-disc ml-5">
                <li>Lembar Pengesahan Badan Hukum oleh Kemenkumham</li>
                <li>KTP/SIM/Paspor pengurus</li>
                <li>AD/ART Organisasi</li>
              </ul>
            </li>
            <li>
              <strong>Data pendukung laporan (bisa salah satu atau lebih):</strong>
              <ul className="list-disc ml-5">
                <li>Foto</li>
                <li>Dokumen tertulis</li>
                <li>Rekaman suara atau video</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Formulir */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md border">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Lembar Pengaduan Masyarakat</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nama" className="block font-medium">Nama Lengkap</label>
              <input
                id="nama"
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="kontak" className="block font-medium">Nomor Telepon / Email</label>
              <input
                id="kontak"
                type="text"
                name="kontak"
                value={formData.kontak}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="jenisPemohon" className="block font-medium">Jenis Pemohon</label>
              <select
                id="jenisPemohon"
                name="jenisPemohon"
                value={formData.jenisPemohon}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Individu">Individu</option>
                <option value="Kelompok Orang">Kelompok Orang</option>
                <option value="Organisasi Berbadan Hukum">Organisasi Berbadan Hukum</option>
              </select>
            </div>

            <div>
              <label htmlFor="judul" className="block font-medium">Judul Laporan</label>
              <input
                id="judul"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="isiLaporan" className="block font-medium">Deskripsi</label>
              <textarea
                id="isiLaporan"
                name="isiLaporan"
                value={formData.isiLaporan}
                onChange={handleChange}
                rows={5}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="identitas" className="block font-medium">Upload Identitas (KTP/SIM/Paspor)</label>
              <input
                id="identitas"
                type="file"
                name="identitas"
                onChange={handleFileChange}
                accept=".jpg,.png,.pdf"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {formData.jenisPemohon === "Organisasi Berbadan Hukum" && (
              <div>
                <label htmlFor="dokumenOrganisasi" className="block font-medium">Dokumen Organisasi (Pengesahan, AD/ART)</label>
                <input
                  id="dokumenOrganisasi"
                  type="file"
                  name="dokumenOrganisasi"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            <div>
              <label htmlFor="buktiPendukung" className="block font-medium">Upload Bukti/Data Pendukung</label>
              <input
                id="buktiPendukung"
                type="file"
                name="buktiPendukung"
                onChange={handleFileChange}
                accept=".jpg,.png,.pdf,.doc,.docx,.mp4,.mp3"
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
            >
              Kirim Laporan
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PengaduanMasyarakat;
