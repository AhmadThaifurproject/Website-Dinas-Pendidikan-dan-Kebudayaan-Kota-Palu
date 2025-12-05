// src/components/FilePreview.tsx
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Styles wajib agar toolbar dan layout tampil rapi
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

type FilePreviewProps = {
    fileUrl: string;
};

export default function FilePreview({ fileUrl }: FilePreviewProps) {
    // Plugin bawaan: sudah termasuk toolbar (zoom, next/prev page, download, print)
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const isPDF = fileUrl?.toLowerCase().endsWith('.pdf');
    if (!fileUrl) return null;

    return (
        <div className="relative bg-white rounded-lg shadow p-4 w-full max-w-3xl mx-auto">
            {isPDF ? (
                // ✅ Tidak perlu set pdfjs.GlobalWorkerOptions.workerSrc manual
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <div style={{ height: '300px', border: '1px solid #ccc' }}>
                        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
                    </div>
                </Worker>
            ) : (
                // Jika bukan PDF tetap preview gambar biasa
                <img
                    src={fileUrl}
                    alt="Preview"
                    className="w-full max-h-[80vh] object-contain"
                />
            )}
        </div>
    );
}
