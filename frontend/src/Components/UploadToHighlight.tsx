import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";

interface Props {
  slug: string;
}

const UploadToHighlight: React.FC<Props> = ({ slug }) => {
  const [kategori, setKategori] = useState("");
  const [showForm, setShowForm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tutup popup saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpload = async () => {
  if (!kategori) {
    Swal.fire("Pilih kategori terlebih dahulu", "", "warning");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("kategori", kategori);

    const uploadRes = await fetch("http://localhost:8000/api/berita/set-highlight", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (uploadRes.ok) {
      Swal.fire("Berhasil!", "Berita diunggah ke highlight.", "success");
      setKategori("");
      setShowForm(false);
    } else {
      Swal.fire("Gagal mengunggah", "Cek validasi data atau koneksi", "error");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Terjadi kesalahan", "Gagal upload highlight", "error");
  }
};


  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setShowForm((v) => !v)}
        title="Upload ke Highlight"
        className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
      >
        📌
      </button>

      {showForm && (
        <div className="absolute left-1/2 top-[-100%] transform -translate-x-1/2 -translate-y-1/2 z-50 w-64 bg-white border border-gray-300 rounded-lg shadow-xl p-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Kategori Highlight</h4>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 mb-3"
          >
            <option value="">-- Pilih Kategori --</option>
            <option value="terkini">Berita Terkini</option>
            <option value="populer">Berita Populer</option>
          </select>

          <div className="flex justify-between">
            <button
              onClick={handleUpload}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
            >
              Upload
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-800 text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadToHighlight;
