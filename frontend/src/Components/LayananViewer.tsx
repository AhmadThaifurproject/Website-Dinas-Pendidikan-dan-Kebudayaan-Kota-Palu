import React, { useEffect, useState } from "react";
import FilePreview from "./FilePreview";

interface CardInfo {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FileItem {
  name: string;
  url: string; // url dari backend (raw)
  previewUrl?: string; // url yang sudah diubah untuk preview
}

interface LayananViewerProps {
  judul: string;
  deskripsi: string;
  endpoint: string;
  cards: CardInfo[];
}

export default function LayananViewer({
  judul,
  deskripsi,
  endpoint,
  cards,
}: LayananViewerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);

  // Fungsi untuk membangun URL preview berdasarkan URL file lama
  const buildPreviewUrl = (rawUrl: string): string => {
    try {
      const urlObj = new URL(rawUrl);
      const parts = urlObj.pathname.split("/").filter(Boolean);

      if (parts.length < 4 || parts[0] !== "storage") {
        return rawUrl;
      }

      const folder = parts[1];
      const subfolder = parts[2];
      const filename = parts.slice(3).join("/");

      return `http://localhost:8000/preview/${folder}/${subfolder}/${filename}`;
    } catch {
      return rawUrl;
    }
  };

  useEffect(() => {
  const fetchFiles = () => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          const mappedFiles = data.files.map((file: FileItem) => ({
            ...file,
            previewUrl: buildPreviewUrl(file.url),
          }));
          setFiles(mappedFiles);
        } else {
          setFiles([]);
        }
      })
      .catch(() => setFiles([]));
  };

  fetchFiles(); // fetch pertama

  const interval = setInterval(fetchFiles, 3000); // tiap 10 detik auto refresh
  return () => clearInterval(interval);
}, [endpoint]);

  const firstFileUrl = files.length > 0 ? files[0].previewUrl ?? "" : "";

  return (
    <div className="min-h-screen bg-gray-100 pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{judul}</h1>
          <p className="text-gray-600 text-sm mb-4">{deskripsi}</p>
        </div>

        {/* Preview file pertama */}
        {firstFileUrl && (
          <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-md bg-black/5 p-2">
            {firstFileUrl.toLowerCase().endsWith(".pdf") ? (
              // Mode PDF → pakai FilePreview
              <FilePreview fileUrl={firstFileUrl} />
            ) : (
              // Mode Gambar → tampilkan full dengan object-contain
              <div className="flex justify-center items-center bg-white rounded-lg max-h-[80vh]">
                <img
                  src={firstFileUrl}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            )}

            {/* Tombol buka tab baru */}
            <div className="absolute top-2 right-2 z-10">
              <a
                href={firstFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded-full shadow hover:bg-blue-600 hover:text-white transition"
              >
                🔗 Buka Tab Baru
              </a>
            </div>
          </div>
        )}


        {/* Tombol download file pertama */}
        {firstFileUrl && (
          <div className="flex justify-center">
            <a
              href={firstFileUrl}
              download
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition mt-4"
            >
              Download PDF / Gambar
            </a>
          </div>
        )}

        {/* Cards info */}
        <div className="space-y-4 mt-10">
          {cards.map((card, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-50 p-4 rounded-lg shadow-md"
            >
              <div className="w-1/4 flex justify-center text-blue-600">
                {card.icon}
              </div>
              <div className="w-3/4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
