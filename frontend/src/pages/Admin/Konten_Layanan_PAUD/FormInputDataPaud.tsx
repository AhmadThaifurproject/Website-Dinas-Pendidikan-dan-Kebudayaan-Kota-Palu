// src/pages/Admin/Konten_Layanan_Paud/FormInputDataPaud.tsx
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { Trash2, FileImage, FileText, Loader2 } from "lucide-react";
import DuplicateFileAlert from "../../../Components/DuplicateFileAlert";
import { useThemeAdmin } from "../../../Components/themeContextAdmin";

type FormInputDataProps = {
  selectedCategory: string; // sebaiknya 'paud'
};

const layananOptions = [
  { label: "Layanan BOS Paud Non-Formal", value: "bos-nonformal" },
  { label: "Layanan Dana BOS", value: "dana-bos" },
  { label: "Layanan Dana Dak", value: "dana-dak" },
  { label: "Layanan Dapodik Paud Dan PNF", value: "dapodik-paud-pnf" },
  { label: "Layanan Data Lembaga Paud", value: "data-lembaga-paud" },
  { label: "Layanan Izin Pendirian", value: "izin-pendirian" },
  { label: "Layanan Legalisir Paud", value: "legalisir-paud" },
  { label: "Layanan Legalisir SKHU", value: "legalisir-skhu" },
  { label: "Layanan Mutasi Paud", value: "mutasi-paud" },
  { label: "Layanan Pendaftaran Paud", value: "daftar-paud" },
  { label: "Layanan Rekomendasi Pendirian", value: "req-pendirian" },
  { label: "Layanan Suket Paud", value: "suket-paud" },
];

export default function FormInputData({ selectedCategory }: FormInputDataProps) {
  const [selectedLayanan, setSelectedLayanan] = useState(layananOptions[0].value);
  const [file, setFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeAdmin();

  const [duplicateInfo, setDuplicateInfo] = useState<{ locations: string[]; file: File } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/${selectedCategory.toLowerCase()}/upload/${selectedLayanan}`
      );
      const data = await res.json();
      setFileList(data.files || []);
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire("Error", "Gagal mengambil daftar file.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedCategory, selectedLayanan]);

  const handleUpload = async (force: boolean = false) => {
    if (!file) {
      Swal.fire("Peringatan", "Pilih file terlebih dahulu.", "warning");
      return;
    }

    if (fileList.length > 0 && !force) {
      Swal.fire("Peringatan", "Anda hanya boleh upload 1 file untuk layanan ini.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (force) formData.append("force", "true");

    setUploading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/${selectedCategory.toLowerCase()}/upload/${selectedLayanan}`,
        { method: "POST", body: formData }
      );

      if (res.ok) {
        const data = await res.json();
        setFileList(force ? [{ name: file.name, url: data.url }] : [...fileList, { name: file.name, url: data.url }]);
        Swal.fire("Sukses", "Upload berhasil.", "success");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setDuplicateInfo(null);
      } else if (res.status === 409) {
        const data = await res.json();
        if (data.locations && data.locations.length > 0) {
          setDuplicateInfo({ locations: data.locations, file });
        } else {
          Swal.fire("Gagal", data.message || "File dengan nama sama sudah ada.", "error");
        }
      } else {
        Swal.fire("Gagal", "Upload gagal.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Terjadi kesalahan saat upload.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    const confirmResult = await Swal.fire({
      title: `Yakin ingin hapus file ini?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirmResult.isConfirmed) return;

    setDeleting(filename);
    try {
      const res = await fetch(
        `http://localhost:8000/api/${selectedCategory.toLowerCase()}/upload/${selectedLayanan}/${filename}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setFileList((prev) => prev.filter((f) => f.name !== filename));
        Swal.fire("Berhasil", "File berhasil dihapus.", "success");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setFile(null);
      } else {
        Swal.fire("Gagal", "Gagal menghapus file.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus file.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const renderFilePreview = (file: any) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg"].includes(ext)) {
      return <img src={file.url} alt={file.name} className="w-12 h-12 object-cover rounded" />;
    }
    if (ext === "pdf") {
      return <FileText className="w-10 h-10 text-red-500" />;
    }
    return <FileImage className="w-10 h-10 text-gray-400" />;
  };

  return (
    <div className={`p-6 rounded-xl shadow-md transition-colors 
      ${theme === "light" ? "bg-white border border-gray-200 text-gray-900" : "bg-gray-800 border border-gray-700 text-gray-100"}`}>
      
      <h1 className={`text-2xl font-bold text-center mb-6 ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>
        Form Upload Data Layanan - {selectedCategory}
      </h1>

      {/* Pilih Layanan */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>
          Pilih Layanan
        </label>
        <select
          value={selectedLayanan}
          onChange={(e) => setSelectedLayanan(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 
            ${theme === "light" ? "bg-white text-gray-900 border-gray-300" : "bg-gray-700 text-gray-100 border-gray-600"}
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
        >
          {layananOptions.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className={`${theme === "light" ? "bg-white text-gray-900" : "bg-gray-700 text-gray-100"}`}
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Input File */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1 ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>
          Upload File
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className={`block w-full text-sm
            ${theme === "light" ? "text-gray-700" : "text-gray-100"}
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            ${theme === "light" ? "file:bg-blue-50 file:text-blue-700" : "file:bg-gray-600 file:text-gray-100"}
            hover:file:bg-blue-100 dark:hover:file:bg-gray-500`}
        />
      </div>

      {/* Tombol Upload */}
      <div className="text-center mb-6">
        <button
          onClick={() => handleUpload()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 
                     disabled:bg-blue-400 text-white px-6 py-2 rounded-lg shadow transition"
        >
          {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
          {uploading ? "Mengunggah..." : "Upload"}
        </button>
      </div>

      {/* DuplicateFileAlert */}
      {duplicateInfo && (
        <DuplicateFileAlert
          fileName={duplicateInfo.file.name}
          locations={duplicateInfo.locations}
          onCancel={() => setDuplicateInfo(null)}
          onConfirm={() => handleUpload(true)}
        />
      )}

      {/* Daftar File */}
      <div className="mt-6">
        <h2 className={`text-lg font-semibold mb-3 ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>
          File Terupload
        </h2>
        {loading ? (
          <p className={`text-sm ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>Memuat file...</p>
        ) : fileList.length === 0 ? (
          <p className={`text-sm ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>Belum ada file.</p>
        ) : (
          <ul className="space-y-2">
            {fileList.map((file, i) => (
              <li
                key={i}
                className={`flex items-center justify-between px-4 py-2 rounded-lg shadow-sm 
                  ${theme === "light" ? "bg-gray-50" : "bg-gray-700"}`}
              >
                <div className="flex items-center gap-3">
                  {renderFilePreview(file)}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {file.name}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(file.name)}
                  disabled={deleting === file.name}
                  className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
                >
                  {deleting === file.name ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
