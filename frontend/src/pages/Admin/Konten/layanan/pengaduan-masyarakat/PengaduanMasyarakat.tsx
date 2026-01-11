import React, { useEffect, useState } from "react";
import axios from "axios";

interface Pengaduan {
  id: number;
  nama: string;
  kontak: string;
  jenis_pemohon: string;
  judul: string;
  isi_laporan: string;
  status: string;
  tanggapan?: string;
  identitas_path?: string;
  dokumen_organisasi_path?: string;
  bukti_pendukung_path?: string;
  created_at: string;
}

export default function PengaduanMasyarakat() {
  const [pengaduanList, setPengaduanList] = useState<Pengaduan[]>([]);
  const [selectedPengaduan, setSelectedPengaduan] = useState<Pengaduan | null>(null);
  const [tanggapan, setTanggapan] = useState("");

  useEffect(() => {
    fetchPengaduan();
  }, []);

  const fetchPengaduan = async () => {
    try {
      const response = await axios.get("/api/pengaduan");
      setPengaduanList(response.data);
    } catch (error) {
      console.error("Gagal memuat data pengaduan:", error);
    }
  };

  const handleTanggapi = async () => {
    if (!selectedPengaduan) return;
    try {
      await axios.put(`/api/pengaduan/${selectedPengaduan.id}/tanggapan`, {
        tanggapan,
        status: "Ditanggapi",
      });
      setTanggapan("");
      setSelectedPengaduan(null);
      fetchPengaduan();
    } catch (error) {
      console.error("Gagal mengirim tanggapan:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Daftar Pengaduan Masyarakat</h1>

      <table className="w-full border bg-white rounded-lg shadow mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Judul</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pengaduanList.map((pengaduan) => (
            <tr key={pengaduan.id} className="border-t">
              <td className="p-3">{pengaduan.nama}</td>
              <td className="p-3">{pengaduan.judul}</td>
              <td className="p-3">{pengaduan.status}</td>
              <td className="p-3">
                <button
                  onClick={() => setSelectedPengaduan(pengaduan)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Lihat Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPengaduan && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Detail Pengaduan</h2>
          <p><strong>Nama:</strong> {selectedPengaduan.nama}</p>
          <p><strong>Kontak:</strong> {selectedPengaduan.kontak}</p>
          <p><strong>Jenis Pemohon:</strong> {selectedPengaduan.jenis_pemohon}</p>
          <p><strong>Judul:</strong> {selectedPengaduan.judul}</p>
          <p><strong>Isi Laporan:</strong> {selectedPengaduan.isi_laporan}</p>
          <p><strong>Status:</strong> {selectedPengaduan.status}</p>
          {selectedPengaduan.tanggapan && (
            <p className="text-green-700"><strong>Tanggapan:</strong> {selectedPengaduan.tanggapan}</p>
          )}

          {/* File-link */}
          <div className="mt-4 space-y-2">
            {selectedPengaduan.identitas_path && (
              <div>
                <strong>Identitas:</strong>{" "}
                <a
                  href={`/storage/${selectedPengaduan.identitas_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat File
                </a>
              </div>
            )}
            {selectedPengaduan.dokumen_organisasi_path && (
              <div>
                <strong>Dokumen Organisasi:</strong>{" "}
                <a
                  href={`/storage/${selectedPengaduan.dokumen_organisasi_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat File
                </a>
              </div>
            )}
            {selectedPengaduan.bukti_pendukung_path && (
              <div>
                <strong>Bukti Pendukung:</strong>{" "}
                <a
                  href={`/storage/${selectedPengaduan.bukti_pendukung_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat File
                </a>
              </div>
            )}
          </div>

          {/* Form Tanggapan */}
          <textarea
            value={tanggapan}
            onChange={(e) => setTanggapan(e.target.value)}
            className="w-full mt-4 p-3 border rounded"
            placeholder="Tulis tanggapan Anda..."
            rows={4}
          ></textarea>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleTanggapi}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Kirim Tanggapan
            </button>
            <button
              onClick={() => {
                setSelectedPengaduan(null);
                setTanggapan("");
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
