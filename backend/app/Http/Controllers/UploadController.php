<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function upload(Request $request, $bidang, $layanan)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:50480',
        ]);

        $bidang = strtolower($bidang);
        $layanan = strtolower($layanan);

        $folder = "$bidang/$layanan";
        $originalName = $request->file('file')->getClientOriginalName();
        $path = "$folder/$originalName";

        // 🔑 Ambil flag force dari request
        $force = $request->has('force') && $request->input('force') === 'true';

        // 🚫 Cek apakah file dengan nama sama sudah ada di lokasi ini
        if (Storage::disk('public')->exists($path)) {
            if ($force) {
                // Hapus file lama, ganti dengan file baru
                Storage::disk('public')->delete($path);
            } else {
                return response()->json([
                    'message' => 'Gagal, file dengan nama yang sama sudah ada di lokasi ini. Silakan ganti nama file Anda.'
                ], 409);
            }
        }

        // 🔍 Cek apakah file dengan nama sama ada di lokasi lain
        $allFiles = Storage::disk('public')->allFiles();
        $duplicateLocations = [];

        foreach ($allFiles as $f) {
            if (basename($f) === $originalName && $f !== $path) {
                $duplicateLocations[] = dirname($f); // contoh hasil: "ketenagaan/karpeg"
            }
        }

        if (!empty($duplicateLocations) && !$force) {
            return response()->json([
                'message'   => 'File dengan nama sama ditemukan di lokasi lain',
                'locations' => $duplicateLocations
            ], 409);
        }

        // ✅ Simpan file ke folder tujuan (replace jika force = true)
        $request->file('file')->storeAs($folder, $originalName, 'public');

        return response()->json([
            'message' => 'File berhasil diupload',
            'path' => $path,
            'url' => asset('storage/' . $path),
            'originalName' => $originalName,
        ]);
    }

    public function getFiles($bidang, $layanan)
    {
        $bidang = strtolower($bidang);
        $layanan = strtolower($layanan);

        $folder = "$bidang/$layanan";

        $files = Storage::disk('public')->files($folder);

        $data = array_map(function ($filePath) {
            return [
                'name' => basename($filePath),
                'url'  => asset('storage/' . $filePath),
            ];
        }, $files);

        return response()->json(['files' => $data]);
    }

    public function deleteFile($bidang, $layanan, $filename)
    {
        $bidang = strtolower($bidang);
        $layanan = strtolower($layanan);

        $path = "$bidang/$layanan/$filename";

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return response()->json(['message' => 'File berhasil dihapus']);
        } else {
            return response()->json(['message' => 'File tidak ditemukan'], 404);
        }
    }
}
