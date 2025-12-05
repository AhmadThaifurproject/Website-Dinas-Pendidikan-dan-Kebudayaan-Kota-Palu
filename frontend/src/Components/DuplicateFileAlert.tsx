// src/Components/DuplicateFileAlert.tsx
import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

type DuplicateFileAlertProps = {
  fileName: string;
  locations: string[];
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

const DuplicateFileAlert: React.FC<DuplicateFileAlertProps> = ({
  fileName,
  locations,
  onCancel,
  onConfirm,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true); // setelah 0 tombol bisa dipakai
    }
  }, [countdown]);

  const handleConfirm = async () => {
    if (!isReady) return;

    // jalankan upload ulang
    await onConfirm();

    // tutup modal setelah user pilih "Lanjutkan"
    onCancel();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md text-center">
        {/* Icon Danger */}
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-14 h-14 text-yellow-500" />
        </div>

        {/* Judul */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          File Duplikat Ditemukan
        </h2>

        {/* Deskripsi */}
        <p className="text-gray-600 dark:text-gray-300 mb-3">
          File <span className="font-semibold">{fileName}</span> sudah ada di lokasi berikut:
        </p>

        <ul className="list-disc pl-6 text-sm text-gray-700 dark:text-gray-300 mb-4 text-left">
          {locations.map((loc, i) => (
            <li key={i}>{loc}</li>
          ))}
        </ul>

        <p className="text-gray-600 dark:text-gray-400 mb-5">
          Apakah Anda yakin ingin tetap mengunggah?
        </p>

        {/* Tombol Aksi */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 
                       dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 
                       dark:text-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isReady}
            className={`px-4 py-2 rounded-lg shadow transition ${
              !isReady
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {!isReady ? `Lanjutkan (${countdown})` : "Lanjutkan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateFileAlert;
